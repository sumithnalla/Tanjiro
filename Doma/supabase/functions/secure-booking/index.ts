import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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
  return selectedDate >= today && selectedDate <= new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Max 1 year ahead
};

// Rate limiting storage (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const checkRateLimit = (key: string, maxRequests: number = 5, windowMs: number = 300000): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  return true;
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
      venue_id,
      slot_id,
      booking_date,
      booking_name,
      persons,
      whatsapp,
      email,
      decoration,
      advance_paid,
      payment_id,
      event_type,
      cake_selection,
      selected_addons,
      total_amount,
      extra_person_charges,
    } = body;

    // Rate limiting
    const clientKey = `${email}_${req.headers.get('x-forwarded-for') || 'unknown'}`;
    if (!checkRateLimit(clientKey)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate required fields
    if (!venue_id || !slot_id || !booking_date || !booking_name || !whatsapp || !email || !event_type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate input formats
    if (!validateUUID(venue_id) || !validateUUID(slot_id)) {
      return new Response(
        JSON.stringify({ error: 'Invalid venue or slot ID' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validateDate(booking_date)) {
      return new Response(
        JSON.stringify({ error: 'Invalid booking date' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validateBookingName(booking_name)) {
      return new Response(
        JSON.stringify({ error: 'Booking name must be between 2-50 characters' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!validatePhone(whatsapp)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (typeof persons !== 'number' || persons < 1 || persons > 20) {
      return new Response(
        JSON.stringify({ error: 'Invalid number of persons' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if slot is available
    const { data: isAvailable, error: checkError } = await supabaseClient
      .rpc('is_slot_available', {
        p_venue_id: venue_id,
        p_slot_id: slot_id,
        p_booking_date: booking_date,
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
        JSON.stringify({ error: 'Slot is already booked' }),
        { 
          status: 409, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      venue_id,
      slot_id,
      booking_date,
      booking_name: sanitizeInput(booking_name),
      persons,
      whatsapp: sanitizeInput(whatsapp),
      email: sanitizeInput(email),
      decoration: Boolean(decoration),
      advance_paid: Boolean(advance_paid),
      payment_id: payment_id ? sanitizeInput(payment_id) : null,
      event_type: sanitizeInput(event_type),
      cake_selection: cake_selection ? sanitizeInput(cake_selection) : null,
      selected_addons: selected_addons ? sanitizeInput(selected_addons) : null,
      total_amount: total_amount ? parseInt(total_amount) : null,
      extra_person_charges: extra_person_charges ? parseInt(extra_person_charges) : 0,
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
          action: 'BOOKING_CREATED',
          user_ip: req.headers.get('x-forwarded-for'),
          user_agent: req.headers.get('user-agent'),
        });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
      // Don't fail the booking if audit logging fails
    }

    return new Response(
      JSON.stringify({ 
        booking_id: booking.id, 
        message: 'Booking created successfully',
        booking: booking
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      },
    );
  } catch (error) {
    console.error('Secure booking error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});