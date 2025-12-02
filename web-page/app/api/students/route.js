import Student from "@/app/lib/models/models";
import connectMongoDB from "@/app/lib/mongodbConnection";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        await connectMongoDB();

        // Derive allowed fields from the Mongoose schema (exclude _id and __v)
        const schemaFields = Object.keys(Student.schema.paths).filter(
            (p) => !["_id", "__v"].includes(p)
        );

        // Build document only with fields present in the schema
        const data = {};
        for (const key of schemaFields) {
            if (body[key] !== undefined) data[key] = body[key];
        }

        // Check for required fields defined in the schema
        const requiredFields = schemaFields.filter((k) => {
            const path = Student.schema.paths[k];
            return Boolean(path?.options?.required || path?.isRequired);
        });
        const missing = requiredFields.filter((k) => data[k] === undefined);
        if (missing.length) {
            return NextResponse.json(
                { error: `Missing required fields: ${missing.join(", ")}` },
                { status: 400 }
            );
        }

        const createdStudent = await Student.create(data);
        return NextResponse.json({ student: createdStudent }, { status: 201 });
    } catch (error) {
        console.error("Error creating student:", error);
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