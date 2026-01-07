import type { Meta, StoryObj } from "@storybook/react";
import PostList from "./PostList";

const meta: Meta<typeof PostList> = {
  title: "Components/PostList",
  component: PostList,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PostList>;

const mockPosts = [
  {
    id: 1,
    title: "Next.js 15 버전의 새로운 기능들",
    content: "서버 컴포넌트와 클라이언트 컴포넌트의 조화...",
    createdAt: new Date(),
    category: { id: 1, name: "Next.js" },
    author: { name: "HanaAdmin" },
    _count: { likes: 12, comments: 4 },
  },
  {
    id: 2,
    title: "Tailwind CSS로 블로그 꾸미기",
    content: "Utility-first CSS의 장점은 무엇인가?",
    createdAt: new Date(Date.now() - 86400000), // 1일 전
    category: { id: 2, name: "Design" },
    author: { name: "User1" },
    _count: { likes: 5, comments: 2 },
  },
];

export const Default: Story = {
  args: {
    posts: mockPosts,
  },
};

export const Empty: Story = {
  args: {
    posts: [],
  },
};
