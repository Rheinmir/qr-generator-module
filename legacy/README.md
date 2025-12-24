QR Generator Pro - Minimalist Edition

1. Tổng quan dự án

Đây là một Mini App cho phép người dùng tạo mã QR tùy chỉnh theo định dạng mong muốn. Điểm khác biệt so với các trình tạo QR thông thường là khả năng định nghĩa các "Key" (nhãn) và "Value" (giá trị) linh hoạt, phù hợp cho việc tạo mã QR nhân viên, thẻ tài sản, hoặc quản lý kho.

Phong cách thiết kế: Minimalist & Macism (Apple-inspired).

2. Cấu trúc tệp hiện tại

Dự án hiện đang được triển khai dưới dạng Single File (SFC) để tối ưu hóa việc thử nghiệm và tích hợp nhanh.

File: qr_generator.html

Công nghệ sử dụng:

UI Framework: Tailwind CSS (via CDN).

Iconography: Font Awesome 6.4.

QR Library: qrcode.js (Thư viện nhẹ, ổn định cho việc render Canvas/Image).

Fonts: System Fonts (SF Pro, Inter, v.v.)

3. Các tính năng đã hoàn thiện (MVP)

Dynamic Form:

Thêm/Xóa không giới hạn các trường dữ liệu.

Cho phép sửa trực tiếp cả Nhãn (Key) và Nội dung (Value).

Real-time Synchronization: Mã QR tự động cập nhật ngay khi người dùng gõ phím mà không cần nhấn nút "Tạo".

Hệ thống UI/UX:

Bố cục lưới (Grid) linh hoạt, hỗ trợ tốt từ di động đến máy tính.

Hiệu ứng chuyển cảnh (Animation) mượt mà bằng Tailwind animate-in.

Thanh cuộn (Scrollbar) tùy chỉnh theo phong cách macOS.

Tiện ích:

Tải xuống mã QR định dạng .png.

Sao chép nội dung văn bản thô vào Clipboard.

Hệ thống Toast Notification thông báo trạng thái.

4. Đặc tả kỹ thuật (Cho Dev Team)

Dữ liệu (State)

Dữ liệu được quản lý thông qua một mảng các đối tượng (Object) trong JavaScript:

let fields = [
    { id: 1, key: 'ID', value: '1024' },
    { id: 2, key: 'NAME', value: 'Alex Nguyen' },
    ...
];


Logic xử lý QR

Hàm updateQR() sẽ gộp mảng fields thành một chuỗi văn bản phân tách bằng ký tự xuống dòng (\n).

Sử dụng cấu hình CorrectLevel.M hoặc H để đảm bảo mã QR vẫn có thể quét được kể cả khi có nhiều dữ liệu.

5. Danh sách đầu việc tiếp theo (Backlog)

Team Dev có thể tập trung phát triển các phần sau:

Persistence (Lưu trữ): Tích hợp localStorage để lưu lại bộ khung (format) mà người dùng đã thiết lập, tránh mất dữ liệu khi F5.

QR Styling: Thêm tùy chọn chỉnh sửa màu sắc (colorDark, colorLight) và chèn Logo vào giữa mã QR.

Batch Export: Hỗ trợ nhập danh sách từ file Excel để tạo hàng loạt mã QR cùng lúc.

History: Lưu lịch sử các mã đã tạo gần đây.

6. Hướng dẫn chạy

Mở trực tiếp file qr_generator.html trên bất kỳ trình duyệt hiện đại nào (Chrome, Safari, Edge). Không cần cài đặt môi trường server phức tạp cho bản prototype này.

Tài liệu được khởi tạo tự động dựa trên bản thiết kế concept v2.