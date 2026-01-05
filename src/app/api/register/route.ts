import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    // 1. 필수 입력값 검증
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    // 2. 불용어(StopWord) 체크 (과제 필수 요구사항)
    // 이름에 금지어가 포함되어 있는지 확인합니다.
    const stopWords = await prisma.stopWord.findMany();
    const isStopWordUsed = stopWords.some((sw) => name.includes(sw.word));

    if (isStopWordUsed) {
      return NextResponse.json(
        { message: "이름에 부적절한 단어가 포함되어 있습니다." },
        { status: 400 }
      );
    }

    // 3. 이메일 중복 체크
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 400 }
      );
    }

    // 4. 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. 유저 생성
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: "USER", // 기본 가입은 일반 유저
      },
    });

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다." },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    return NextResponse.json(
      { message: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
