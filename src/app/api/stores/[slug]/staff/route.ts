import { NextRequest, NextResponse } from "next/server";
import { devStore } from "@/lib/dev-store";
import { checkStaffLimit } from "@/lib/plan-limits";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const staff = devStore.getStaff(slug);
  const planLimit = checkStaffLimit(store.plan, staff.filter((s) => s.role !== "owner").length);

  return NextResponse.json({ ok: true, staff, planLimit, plan: store.plan });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const store = devStore.getStore(slug);
  if (!store) {
    return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const { email, name, role = "fulfillment", phone } = body;

  if (!email || !name || !email.includes("@")) {
    return NextResponse.json(
      { ok: false, error: "Valid name and email are required" },
      { status: 400 }
    );
  }

  const validRoles = ["owner", "manager", "fulfillment", "catalog_editor"];
  if (!validRoles.includes(role)) {
    return NextResponse.json({ ok: false, error: "Invalid role specified" }, { status: 400 });
  }

  const existingStaff = devStore.getStaff(slug);
  const currentNonOwnerCount = existingStaff.filter((s) => s.role !== "owner").length;
  const limitCheck = checkStaffLimit(store.plan, currentNonOwnerCount);

  if (!limitCheck.allowed) {
    return NextResponse.json(
      {
        ok: false,
        upgrade: true,
        error: `Staff account limit reached (${limitCheck.current}/${limitCheck.limit}). Upgrade to Medium or Pro to add more team members.`,
      },
      { status: 403 }
    );
  }

  const newStaff = devStore.addStaff(slug, {
    email: email.trim().toLowerCase(),
    name: name.trim(),
    role,
    phone: phone?.trim(),
    status: "active",
  });

  devStore.logAuditEvent(slug, {
    action: "staff_invited",
    actorEmail: "merchant@storeswift.app",
    actorRole: "owner",
    details: `Invited ${name} (${email}) as ${role}`,
  });

  return NextResponse.json({ ok: true, staff: newStaff }, { status: 201 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const staffId = req.nextUrl.searchParams.get("staffId");

  if (!staffId) {
    return NextResponse.json({ ok: false, error: "Staff ID is required" }, { status: 400 });
  }

  const staff = devStore.getStaff(slug).find((s) => s.id === staffId);
  if (!staff) {
    return NextResponse.json({ ok: false, error: "Staff member not found" }, { status: 404 });
  }

  if (staff.role === "owner") {
    return NextResponse.json(
      { ok: false, error: "Cannot delete the primary store owner" },
      { status: 400 }
    );
  }

  devStore.deleteStaff(slug, staffId);

  devStore.logAuditEvent(slug, {
    action: "staff_removed",
    actorEmail: "merchant@storeswift.app",
    actorRole: "owner",
    details: `Removed staff member ${staff.name} (${staff.email})`,
  });

  return NextResponse.json({ ok: true, message: "Staff removed successfully" });
}
