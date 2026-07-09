'use client';

import type { RuleCardData } from './Rulecard';
import RuleCard from './Rulecard';

const CARDS: RuleCardData[] = [
  {
    iconBg: 'bg-[#CDDDFE]',
    icon: '/assets/images/register-huber/chat_text.png',
    title: 'Chọn chủ đề phù hợp',
    rules: 'Bạn có thể tạo sách về hành trình, kỷ niệm, bài học, những điều đã vượt qua, chăm sóc sức khỏe tinh thần, yêu thương và phát triển bản thân, trải nghiệm học tập công việc, định kiến xã hội, hoặc bất kỳ chủ đề nào mang dấu ấn cá nhân. HuLib gọi những bạn chia sẻ câu chuyện là Huber.',
    size: 'small',
  },
  {
    iconBg: 'bg-[#FFE4F1]',
    icon: '/assets/images/register-huber/hand_heart.png',
    title: 'Chia sẻ bằng sự chân thành',
    rules: 'Hãy kể câu chuyện của mình dựa trên trải nghiệm và góc nhìn cá nhân. Tụi mình khuyến khích nội dung lan tỏa sự đồng cảm, thấu hiểu và truyền cảm hứng tích cực, đặc biệt dành cho các bạn trẻ tìm kiếm sự kết nối.',
  },
  {
    iconBg: 'bg-[#C9ECFF]',
    icon: '/assets/images/register-huber/finger_print.png',
    title: 'Đảm bảo tính nguyên bản',
    rules: 'Vui lòng không sử dụng nội dung do AI tạo ra hoặc sao chép từ các nguồn khác. Hãy để mỗi cuốn sách mang tiếng nói và dấu ấn riêng của chính bạn.',
  },
  {
    iconBg: 'bg-[#D9F9CF]',
    icon: '/assets/images/register-huber/shield_check_green.png',
    title: 'Xác minh và an toàn cộng đồng',
    rules: 'HuLib không chịu trách nhiệm xác thực toàn bộ thông tin được chia sẻ trong sách. Tuy nhiên, admin có thể yêu cầu bạn cập nhật profile hoặc thêm thông tin trước khi bài viết được duyệt nhằm đảm bảo cộng đồng phát triển bền vững và an toàn.',
  },
  {
    iconBg: 'bg-[#EEE4F7]',
    icon: '/assets/images/register-huber/hand_shake.png',
    title: 'Đồng hành một cách lành mạnh',
    rules: 'Sau khi được duyệt, Huber sẽ có thử thách tự nguyện để cập nhật thời gian rảnh của mình trên nền tảng (tối thiểu 30 phút mỗi tuần). Thông qua đó, câu chuyện của bạn có thể tiếp cận nhiều Liber hơn — các bạn trẻ trải qua hoàn cảnh tương tự hoặc đang mắc kẹt trong một vấn đề nào đó và tìm thấy sự liên kết từ cuốn sách của bạn.',
  },
];

export default function Rulesgrid() {
  return (
    <div className="mb-8 grid grid-cols-1 gap-[40px] sm:grid-cols-2 lg:grid-cols-5">
      {CARDS.map((card, idx) => (
        <RuleCard key={idx} card={card} />
      ))}
    </div>
  );
}
