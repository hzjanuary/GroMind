// src/Footer.jsx
import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground mt-16 p-8 shadow-inner">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold text-primary-foreground mb-2">GroMind</h3>
          <p className="text-sm text-primary-foreground/90">Đi chợ online, giá rẻ mỗi ngày.</p>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-2">Về chúng tôi</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline hover:text-primary-foreground/70">Giới thiệu</a></li>
            <li><a href="#" className="hover:underline hover:text-primary-foreground/70">Tuyển dụng</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-2">Hỗ trợ</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline hover:text-primary-foreground/70">Liên hệ</a></li>
            <li><a href="#" className="hover:underline hover:text-primary-foreground/70">Câu hỏi thường gặp</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-primary-foreground mb-2">Chính sách</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline hover:text-primary-foreground/70">Bảo mật</a></li>
            <li><a href="#" className="hover:underline hover:text-primary-foreground/70">Đổi trả</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-4 text-center text-sm text-primary-foreground/80">
        © {new Date().getFullYear()} GroMind. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
}

export default Footer;