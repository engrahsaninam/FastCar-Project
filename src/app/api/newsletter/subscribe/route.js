// app/api/newsletter/subscribe/route.js

import { NextResponse } from 'next/server';

BREVO_API_KEY='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'
// Integrated Brevo API functions directly in the route file
const addContactToList = async (email, listId = 2) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify({
        email: email,
        listIds: [listId],
        updateEnabled: true
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to subscribe');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding contact to Brevo:', error);
    throw error;
  }
};

export async function POST(request) {
  try {
    // Get email from request body
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Add contact to Brevo list using the integrated function
    const result = await addContactToList(email);
    
    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    // Handle duplicate contacts gracefully
    if (error.message && error.message.includes('duplicate')) {
      return NextResponse.json(
        { success: true, message: 'You are already subscribed' },
        { status: 200 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}

// Optional: Include the createCampaign function if you need it
const createCampaign = async (campaignData) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/emailCampaigns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        name: campaignData.name || "Welcome Campaign",
        subject: campaignData.subject || "Welcome to our Newsletter",
        sender: campaignData.sender || {
          name: "Your Company Name",
          email: "newsletter@yourcompany.com"
        },
        type: "classic",
        htmlContent: campaignData.htmlContent || "<p>Thank you for subscribing to our newsletter!</p>",
        recipients: {
          listIds: campaignData.listIds || [2]
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create campaign');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Brevo campaign:', error);
    throw error;
  }
};

// You might want an endpoint to create campaigns as well
export async function PUT(request) {
  try {
    const campaignData = await request.json();
    
    const result = await createCampaign(campaignData);
    
    return NextResponse.json(
      { success: true, campaignId: result.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Campaign creation error:', error);
    
    return NextResponse.json(
      { success: false, message: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}