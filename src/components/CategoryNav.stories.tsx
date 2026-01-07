import type { Meta, StoryObj } from "@storybook/react";
import CategoryNav from "./CategoryNav";

const meta: Meta<typeof CategoryNav> = {
  title: "Components/CategoryNav",
  component: CategoryNav,
  // 스토리북 전체에 적용될 기본 설정
  parameters: {
    nextjs: {
      appDirectory: true, // Next.js App Router 환경 시뮬레이션
    },
  },
  // 컴포넌트가 중앙에 오도록 배치
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CategoryNav>;

/**
 * 1. 기본 상태
 * 실제 경로가 '/'일 때, 즉 아무것도 선택되지 않은 초기 모습입니다.
 */
export const Default: Story = {
  args: {
    categories: ["React", "Next.js", "TypeScript", "MySQL"],
  },
  parameters: {
    nextjs: {
      navigation: { pathname: "/" },
    },
  },
};

/**
 * 2. 특정 카테고리 활성화 상태 (React)
 * 현재 접속 경로가 '/category/React'일 때 React 메뉴가 강조되는지 확인합니다.
 */
export const ActiveReact: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/category/React",
      },
    },
  },
};

/**
 * 3. 다른 카테고리 활성화 상태 (Next.js)
 * 다른 메뉴로 이동했을 때 하이라이트가 잘 옮겨가는지 검증합니다.
 */
export const ActiveNextjs: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/category/Next.js",
      },
    },
  },
};

/**
 * 4. 모바일 뷰포트 테스트
 * 작은 화면에서 카테고리 바가 어떻게 반응하는지(줄바꿈 혹은 스크롤) 확인하기 위한 설정입니다.
 */
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: "iphone6",
    },
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};
