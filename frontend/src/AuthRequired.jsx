import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoginDialog from './LoginDialog';
import SimpleLayout from './layouts/SimpleLayout';
import { Lock } from 'lucide-react';

export default function AuthRequired() {
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(true);

  return (
    <SimpleLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Yêu cầu đăng nhập</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            ← Quay về trang chủ
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Lock className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-center">
                Cần đăng nhập để tiếp tục
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Để hoàn tất quá trình đặt hàng, vui lòng đăng nhập hoặc tạo tài
                khoản mới.
              </p>

              <div className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => setShowLoginDialog(true)}
                >
                  Đăng nhập / Đăng ký
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Quay lại giỏ hàng
                </Button>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  <strong>Tại sao cần đăng nhập?</strong>
                </p>
                <ul className="text-sm text-blue-800 dark:text-blue-200 mt-2 space-y-1 list-disc list-inside">
                  <li>Bảo mật thông tin cá nhân của bạn</li>
                  <li>Theo dõi lịch sử đơn hàng</li>
                  <li>Lưu địa chỉ giao hàng yêu thích</li>
                  <li>Nhận thông báo về đơn hàng của bạn</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      />
    </SimpleLayout>
  );
}
