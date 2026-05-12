import { NextResponse } from "next/server";
import { ClientService } from "@/lib/services/clientService";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");
    
    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const cleanInputPhone = phone.replace(/\D/g, "");
    const clients = await ClientService.getAll();
    
    const client = clients.find((c: any) => {
      const cPhone = (c.phone || "").replace(/\D/g, "");
      return cPhone.endsWith(cleanInputPhone) && cleanInputPhone.length >= 10;
    });

    if (!client) {
      return NextResponse.json({ error: "No client found with this phone number." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      token: client._id,
      clientId: client._id
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
