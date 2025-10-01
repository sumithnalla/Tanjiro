import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// HMAC-SHA256 implementation for Deno
async function hmacSha256(key: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const messageData = encoder.encode(message);
  
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const hashArray = Array.from(new Uint8Array(signature));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Input validation functions
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

const validateBookingName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

const validateUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};

const validateDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate >= today && selectedDate <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }

  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_data
    } = body;

    // Validate required payment fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Missing payment verification data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate booking data
    if (!booking_data || !booking_data.venue_id || !booking_data.slot_id || !booking_data.booking_date || 
        !booking_data.booking_name || !booking_data.whatsapp || !booking_data.email || !booking_data.event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate input formats
    if (!validateUUID(booking_data.venue_id) || !validateUUID(booking_data.slot_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid venue or slot ID' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validateDate(booking_data.booking_date)) {
      return new Response(
        JSON.stringify({ error: 'Invalid booking date' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validateBookingName(booking_data.booking_name)) {
      return new Response(
        JSON.stringify({ error: 'Booking name must be between 2-50 characters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validateEmail(booking_data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validatePhone(booking_data.whatsapp)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (typeof booking_data.persons !== 'number' || booking_data.persons < 1 || booking_data.persons > 20) {
      return new Response(
        JSON.stringify({ error: 'Invalid number of persons' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!razorpayKeySecret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay secret not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify payment signature
    const expectedSignature = await hmacSha256(
      razorpayKeySecret,
      `${razorpay_order_id}|${razorpay_payment_id}`
    );

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ error: 'Payment verification failed' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Payment verified successfully, now create booking
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if slot is still available
    const { data: isAvailable, error: checkError } = await supabaseClient
      .rpc('is_slot_available', {
        p_venue_id: booking_data.venue_id,
        p_slot_id: booking_data.slot_id,
        p_booking_date: booking_data.booking_date,
      });

    if (checkError) {
      console.error('Slot availability check error:', checkError);
      return new Response(
        JSON.stringify({ error: 'Failed to check slot availability' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!isAvailable) {
      return new Response(
        JSON.stringify({ error: 'Slot is no longer available' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      venue_id: booking_data.venue_id,
      slot_id: booking_data.slot_id,
      booking_date: booking_data.booking_date,
      booking_name: sanitizeInput(booking_data.booking_name),
      persons: booking_data.persons,
      whatsapp: sanitizeInput(booking_data.whatsapp),
      email: sanitizeInput(booking_data.email),
      decoration: Boolean(booking_data.decoration),
      advance_paid: true, // Payment is verified
      payment_id: razorpay_payment_id,
      event_type: sanitizeInput(booking_data.event_type),
      cake_selection: booking_data.cake_selection ? sanitizeInput(booking_data.cake_selection) : null,
      selected_addons: booking_data.selected_addons ? sanitizeInput(booking_data.selected_addons) : null,
      total_amount: booking_data.total_amount ? parseInt(booking_data.total_amount) : null,
      extra_person_charges: booking_data.extra_person_charges ? parseInt(booking_data.extra_person_charges) : 0,
    };

    // Create booking
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert(sanitizedData)
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return new Response(
        JSON.stringify({ error: 'Failed to create booking' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Log the action in audit log
    try {
      await supabaseClient
        .from('booking_audit_log')
        .insert({
          booking_id: booking.id,
          action: 'PAYMENT_VERIFIED_BOOKING_CREATED',
          user_ip: req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent'),
        });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
      // Don't fail the booking if audit logging fails
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        booking_id: booking.id, 
        message: 'Payment verified and booking created successfully',
        payment_id: razorpay_payment_id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Payment verification error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});