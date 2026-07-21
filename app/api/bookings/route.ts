import { NextResponse } from "next/server";
import { getBookings, saveBookings, isAdminAuthenticated, Booking } from "@/lib/api-helper";

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const bookings = await getBookings();
    // Sort by date/time descending
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    console.error("Bookings GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load bookings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, date, time, type, notes } = body;

    // Validation
    if (!name || !email || !phone || !date || !time || !type) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Phone, Date, Time, Type)" },
        { status: 400 }
      );
    }

    const bookings = await getBookings();

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      name,
      email,
      phone,
      date,
      time,
      type, // 'In-Store Viewing' or 'Virtual Consultation'
      status: "Pending",
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    const saved = await saveBookings(bookings);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to save booking request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, booking: newBooking });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Missing Booking ID or Status" },
        { status: 400 }
      );
    }

    const bookings = await getBookings();
    const index = bookings.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    // Update status
    bookings[index].status = status;
    const saved = await saveBookings(bookings);

    if (!saved) {
      return NextResponse.json(
        { success: false, error: "Failed to save updated booking status" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, booking: bookings[index] });
  } catch (error) {
    console.error("Bookings PUT error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
