// app/api/admin/dashboard/submissions/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/prisma/prismaClient";
import { ADMIN_READ_ROLES, requireRole } from "@/lib/auth/permissions";

export async function GET() {
  try {
    const auth = await requireRole(ADMIN_READ_ROLES);
    if (auth.error) return auth.error;

    // Get the current date
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    // Initialize the submissions array with the last 8 months
    const submissions = [];
    
    // Month names
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    // Get data for the last 8 months
    for (let i = 7; i >= 0; i--) {
      // Calculate the month and year for this data point
      let month = currentMonth - i;
      let year = currentYear;
      
      // Adjust for negative months (previous year)
      if (month < 0) {
        month += 12;
        year -= 1;
      }
      
      // Calculate start and end dates for the month
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0); // Last day of month
      
      // Count projects created in this month
      const count = await prisma.projectMetadata.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      });
      
      // Add data point to submissions array
      submissions.unshift({
        name: monthNames[month],
        submissions: count,
      });
    }
    
    return NextResponse.json({
      submissions,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching submission data:", error);
    return NextResponse.json(
      { error: "Failed to fetch submission data" },
      { status: 500 }
    );
  }
}
