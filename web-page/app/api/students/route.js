import Student from "@/app/lib/models/models";
import connectMongoDB from "@/app/lib/mongodbConnection";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { title, description } = await request.json();
        await connectMongoDB();
        await Student.create({ title, description });
        return NextResponse.json({ message: "Student Created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongoDB();
        const students = await Student.find().lean();
        return NextResponse.json({ students: students }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving students:", error);
        return NextResponse.json({ error: "Failed to retrieve students" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        await connectMongoDB();
        await Student.findByIdAndDelete(id);
        return NextResponse.json({ message: "Student deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
    }
}