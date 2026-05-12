import { NextResponse } from "next/server";
import { ExpenseService } from "@/lib/services/expenseService";

export async function GET() {
  try {
    const expenses = await ExpenseService.getAll();
    return NextResponse.json(expenses);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const id = await ExpenseService.create(data);
    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
