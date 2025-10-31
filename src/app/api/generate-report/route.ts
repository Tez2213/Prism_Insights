import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get simulator URL from environment
    const simulatorUrl = process.env.NEXT_PUBLIC_SIMULATOR_URL;
    
    if (!simulatorUrl) {
      return NextResponse.json(
        { error: 'Report server not configured' },
        { status: 500 }
      );
    }

    // Forward request to EC2 server
    const response = await fetch(`${simulatorUrl}/api/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('EC2 server error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate report from server' },
        { status: response.status }
      );
    }

    // Get PDF blob
    const pdfBuffer = await response.arrayBuffer();
    
    // Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="report.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
