import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SimpleLayout from './layouts/SimpleLayout';
import { AlertCircle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <SimpleLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <AlertCircle className="h-16 w-16 text-destructive" />
            </div>

            <div>
              <h1 className="text-6xl font-extrabold mb-2">404</h1>
              <h2 className="text-2xl font-bold mb-2">Không tìm thấy trang</h2>
              <p className="text-muted-foreground">
                Trang bạn yêu cầu không thể hiển thị. Có thể do lỗi hệ thống
                hoặc trang đã bị di chuyển. Hệ thống đã ghi nhận lỗi này vào
                console.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button className="w-full" onClick={() => navigate('/')}>
                ← Quay về trang chủ
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
                Tải lại trang
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SimpleLayout>
  );
}
