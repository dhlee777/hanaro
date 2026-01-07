import type { Meta, StoryObj } from "@storybook/react";
import SearchInput from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Components/SearchInput",
  component: SearchInput,
  decorators: [
    (Story) => (
      <div className="max-w-md p-4 bg-gray-50 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Empty: Story = {};

export const WithText: Story = {
  parameters: {
    nextjs: {
      navigation: {
        query: { search: "NextAuth 보안" },
      },
    },
  },
};
