import { NextResponse } from "next/server";
import { TuyaContext } from "@tuya/tuya-connector-nodejs";

const tuya = new TuyaContext({
  baseUrl: process.env.TUYA_BASE_URL!,
  accessKey: process.env.TUYA_CLIENT_ID!,
  secretKey: process.env.TUYA_CLIENT_SECRET!,
});

const DEVICE_ID = process.env.TUYA_DEVICE_ID!;

export async function POST() {

  try {

    const response = await tuya.request({
      method: "POST",
      path: `/v1.0/devices/${DEVICE_ID}/commands`,
      body: {
        commands: [
          {
            code: "reset_map",
            value: true
          }
        ]
      }
    });

    return NextResponse.json(response);

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      { success:false },
      { status:500 }
    );
  }
}