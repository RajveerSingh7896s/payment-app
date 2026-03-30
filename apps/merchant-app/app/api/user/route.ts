import { NextResponse } from "next/server"
import db from "@repo/db/client"

export const GET = async () => {
    await db.user.create({
      data: {
        email: "asd@example.com",
        name: "adsads",
        number: "1231231231",
        // In a real endpoint you'd store a bcrypt hash, but this is just a compile-time demo.
        password: "password",
      },
    })

    return NextResponse.json({ message: "hi there" })
}