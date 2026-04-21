import { NextResponse } from "next/server";
import { TuyaContext } from "@tuya/tuya-connector-nodejs";

type RobotCommand = {
  code: string;
  value: boolean | string | number;
};

const tuya = new TuyaContext({
  baseUrl: process.env.TUYA_BASE_URL!,
  accessKey: process.env.TUYA_CLIENT_ID!,
  secretKey: process.env.TUYA_CLIENT_SECRET!,
});

const DEVICE_ID = process.env.TUYA_DEVICE_ID!;

export async function POST(req: Request) {
  try {
    const { command }: { command: RobotCommand } = await req.json();

    console.log("Robot command:", command);

    const response = await tuya.request({
      method: "POST",
      path: `/v1.0/devices/${DEVICE_ID}/commands`,
      body: {
        commands: [
          {
            code: command.code,
            value: command.value,
          },
        ],
      },
    });

    console.log("Tuya response:", response);

    return NextResponse.json({
      success: true,
      tuya: response,
    });
  } catch (error) {
    console.error("Robot error:", error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}