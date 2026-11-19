import React from 'react';

/**
 * Component hiển thị nhãn trạng thái trực quan cho hệ thống
 */
export default function StatusBadge({ type, label }) {
  const getBadgeStyle = () => {
    switch (type) {
      case 'INSTRUCTOR':
        return { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe', title: 'Giảng viên' };
      case 'STUDENT':
        return { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0', title: 'Sinh viên' };
      case 'ACTIVE':
      case 'ON_TIME':
      case 'COMPLETED':
        return { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0', title: label || 'Đúng hạn' };
      case 'LATE':
        return { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca', title: label || 'Nộp muộn' };
      case 'PENDING':
      case 'SUBMITTED':
        return { bg: '#fffbeb', text: '#b45309', border: '#fde68a', title: label || 'Chờ chấm' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1', title: label || type };
    }
  };

  const style = getBadgeStyle();

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        fontSize: '12px',
        fontWeight: '600',
        borderRadius: '9999px',
        backgroundColor: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        lineHeight: 1.2
      }}
    >
      {style.title}
    </span>
  );
}
