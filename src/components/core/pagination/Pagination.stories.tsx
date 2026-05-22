import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Pagination from './Pagination';

const meta = {
  title: 'Core/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    nextjs: { appDirectory: true },
  },
  argTypes: {
    currentPage: { control: { type: 'number', min: 0 } },
    totalPages: { control: { type: 'number', min: 1 } },
    edgePageCount: { control: { type: 'number', min: 0 } },
    middlePagesSiblingCount: { control: { type: 'number', min: 0 } },
    className: { control: 'text' },
    setCurrentPage: { action: 'page changed' },
  },
  args: {
    currentPage: 0,
    totalPages: 10,
    edgePageCount: 1,
    middlePagesSiblingCount: 1,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(args.currentPage);
    return (
      <Pagination
        {...args}
        currentPage={page}
        setCurrentPage={setPage}
      >
        <Pagination.PrevButton>Previous</Pagination.PrevButton>
        <Pagination.Pages />
        <Pagination.NextButton>Next</Pagination.NextButton>
      </Pagination>
    );
  },
};

export const Default: Story = {
  render: function Render() {
    const [page, setPage] = useState(0);
    return (
      <Pagination currentPage={page} setCurrentPage={setPage} totalPages={8}>
        <Pagination.PrevButton>Previous</Pagination.PrevButton>
        <Pagination.Pages />
        <Pagination.NextButton>Next</Pagination.NextButton>
      </Pagination>
    );
  },
};

export const FirstPage: Story = {
  name: 'First page (Prev disabled)',
  render: function Render() {
    const [page, setPage] = useState(0);
    return (
      <Pagination currentPage={page} setCurrentPage={setPage} totalPages={8}>
        <Pagination.PrevButton>Previous</Pagination.PrevButton>
        <Pagination.Pages />
        <Pagination.NextButton>Next</Pagination.NextButton>
      </Pagination>
    );
  },
};

export const LastPage: Story = {
  name: 'Last page (Next disabled)',
  render: function Render() {
    const [page, setPage] = useState(7);
    return (
      <Pagination currentPage={page} setCurrentPage={setPage} totalPages={8}>
        <Pagination.PrevButton>Previous</Pagination.PrevButton>
        <Pagination.Pages />
        <Pagination.NextButton>Next</Pagination.NextButton>
      </Pagination>
    );
  },
};

export const ManyPages: Story = {
  name: 'Many pages (with truncation)',
  render: function Render() {
    const [page, setPage] = useState(10);
    return (
      <Pagination currentPage={page} setCurrentPage={setPage} totalPages={25}>
        <Pagination.PrevButton>Previous</Pagination.PrevButton>
        <Pagination.Pages />
        <Pagination.NextButton>Next</Pagination.NextButton>
      </Pagination>
    );
  },
};

export const FewPages: Story = {
  name: 'Few pages (no truncation)',
  render: function Render() {
    const [page, setPage] = useState(1);
    return (
      <Pagination currentPage={page} setCurrentPage={setPage} totalPages={3}>
        <Pagination.PrevButton>Previous</Pagination.PrevButton>
        <Pagination.Pages />
        <Pagination.NextButton>Next</Pagination.NextButton>
      </Pagination>
    );
  },
};

export const CustomButtons: Story = {
  name: 'Custom prev/next buttons',
  render: function Render() {
    const [page, setPage] = useState(4);
    return (
      <Pagination currentPage={page} setCurrentPage={setPage} totalPages={10}>
        <Pagination.PrevButton as="div">
          {({ disabled }) => (
            <button
              type="button"
              disabled={disabled}
              className="rounded bg-neutral-90 px-3 py-1 text-sm disabled:opacity-40"
            >
              ← Prev
            </button>
          )}
        </Pagination.PrevButton>
        <Pagination.Pages />
        <Pagination.NextButton as="div">
          {({ disabled }) => (
            <button
              type="button"
              disabled={disabled}
              className="rounded bg-neutral-90 px-3 py-1 text-sm disabled:opacity-40"
            >
              Next →
            </button>
          )}
        </Pagination.NextButton>
      </Pagination>
    );
  },
};

export const PagesAsButtons: Story = {
  name: 'Pages rendered as <button>',
  render: function Render() {
    const [page, setPage] = useState(2);
    return (
      <Pagination currentPage={page} setCurrentPage={setPage} totalPages={6}>
        <Pagination.PrevButton>Previous</Pagination.PrevButton>
        <Pagination.Pages as="button" type="button" />
        <Pagination.NextButton>Next</Pagination.NextButton>
      </Pagination>
    );
  },
};
