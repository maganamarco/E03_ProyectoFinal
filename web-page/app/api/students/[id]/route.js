import { NextResponse } from "next/server";
import connectMongoDB from "@/app/lib/mongodbConnection";
import Student from "@/app/lib/models/models";
import { ObjectId } from "mongodb";

export async function PUT(request, { params }) {
    try {
        await connectMongoDB();

        // unwrap params (params can be a Promise)
        const { id } = await params;

        // safely parse JSON body
        let body = null;
        try {
            body = await request.json();
        } catch (parseErr) {
            console.error("Failed to parse JSON body:", parseErr);
            return NextResponse.json({ error: "Invalid or empty JSON body" }, { status: 400 });
        }

        if (!body || Object.keys(body).length === 0) {
            return NextResponse.json({ error: "Empty request body" }, { status: 400 });
        }

        // prevent replacing the document _id
        delete body._id;

        const updated = await Student.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();
        if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

        return NextResponse.json({ student: updated }, { status: 200 });
    } catch (err) {
        console.error("Update error", err);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        const id = await params;
        const oID = new ObjectId(id)
        await connectMongoDB();
        await Student.findByIdAndDelete(oID);
        return NextResponse.json({ message: "Student deleted" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting student:", error);
        return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
    }
}
