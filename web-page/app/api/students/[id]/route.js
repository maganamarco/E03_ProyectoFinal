export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const { newTitle: title, newDescription: description } = await request.json();
        await connectMongoDB();
        await Student.findByIdAndUpdate(id, { title, description }, { new: true });
        return NextResponse.json({ message: "Student updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating student:", error);
        return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
    }
}

