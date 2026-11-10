import bcrypt from "bcrypt";
import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { checkRateLimit, getClientKey } from "@/app/libs/rateLimit";

export async function POST(request: Request) {
  const rateLimit = checkRateLimit(`register:${getClientKey(request)}`, 5, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many registration attempts. Try again later." }, {
      status: 429,
      headers: { "Retry-After": String(rateLimit.retryAfter) },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
  }

  const { email, name, password } = body as Record<string, unknown>;
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
  const normalizedName = typeof name === "string" ? name.trim() : "";
  const passwordBytes = typeof password === "string" ? new TextEncoder().encode(password).length : 0;

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) ||
    normalizedName.length < 1 || normalizedName.length > 100 ||
    typeof password !== "string" || password.length < 8 || passwordBytes > 72
  ) {
    return NextResponse.json({ error: "Enter a valid email, a name up to 100 characters, and a password of 8 to 72 UTF-8 bytes." }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { email: normalizedEmail, name: normalizedName, hashedPassword },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
