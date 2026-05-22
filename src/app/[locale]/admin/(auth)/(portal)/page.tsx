import { redirect } from 'next/navigation';

export default function AdminPortalIndexPage() {
  redirect('/admin/awaiting-stories');
}
