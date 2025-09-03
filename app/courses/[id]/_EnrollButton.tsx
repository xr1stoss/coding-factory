'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EnrollButton({ courseId }: { courseId: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <button
      className="btn"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        const res = await fetch('/api/enrollments', {
          method: 'POST',
          headers: { 'Content-Type':'application/json' },
          body: JSON.stringify({ courseId }),
        });
        setLoading(false);
        if (res.ok) router.refresh(); else alert('Enroll failed');
      }}
    >
      {loading ? 'Enrolling…' : 'Enroll'}
    </button>
  );
}
