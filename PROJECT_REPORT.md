# Báo cáo Dự án QR Generator Pro (Refactored Version)

## 1. Tổng quan dự án
**QR Generator Pro** là ứng dụng web cho phép người dùng tạo mã QR tùy chỉnh chứa dữ liệu có cấu trúc (Key-Value). 
- **Mục đích**: Thay thế các công cụ tạo QR tĩnh thông thường, phục vụ nhu cầu tạo thẻ nhân viên, thẻ kho, hoặc danh thiếp điện tử với dữ liệu động.
- **Điểm đặc biệt**: 
    - Tính năng "Dynamic Fields" cho phép thêm/bớt trường dữ liệu tùy ý.
    - Dữ liệu được lưu trữ tự động (Persistence).
    - **Tạo hàng loạt (Batch Export)**: Hỗ trợ nạp file Excel và xuất ra file ZIP chứa toàn bộ QR code.

## 2. Công nghệ sử dụng (Tech Stack)

Dự án đã được nâng cấp từ một file HTML đơn lẻ sang kiến trúc Modern Web Application:

| Công nghệ | Vai trò | Tại sao sử dụng? |
|-----------|---------|------------------|
| **Vite** | Build Tool | Tốc độ khởi động và build cực nhanh, môi trường dev mượt mà. |
| **React 18** | UI Library | Xây dựng giao diện theo hướng Component-based, dễ bảo trì và mở rộng. |
| **TypeScript** | Language | Bắt lỗi ngay khi code (Static Typing), giúp code an toàn và dễ hiểu hơn. |
| **Tailwind CSS v4** | Styling | Phiên bản mới nhất, hiệu năng cao, viết CSS trực tiếp trên class HTML. |
| **Lucide React** | Icons | Bộ icon hiện đại, nhẹ và đồng bộ. |
| **qrcode.react** | QR Engine | Thư viện React chuyên dụng để render QR Code tối ưu. |

## 3. Kiến trúc hệ thống (Architecture Layers)

Dự án được tổ chức theo mô hình **Component-based Architecture**, chia thành các tầng rõ ràng:

```mermaid
graph TD
    User[User Interaction] --> View[View Layer (Components)]
    View --> Logic[Logic Layer (Hooks/State)]
    Logic --> Data[Data Layer (Types/LocalStorage)]
    
    subgraph "View Layer"
        Layout --> App
        App --> FieldInput[Component xử lý nhập liệu]
        App --> QRDisplay[Component hiển thị QR]
        App --> Toast[Component thông báo]
    end

    subgraph "Logic Layer"
        State[React State (Fields, Options)]
        Hooks[useLocalStorage Hook]
    end

    subgraph "Data Layer"
        Types[TypeScript Interfaces]
        Browser[Browser LocalStorage]
    end
```

### Chi tiết các tầng:

#### A. View Layer (`src/components`)
Chịu trách nhiệm hiển thị giao diện và nhận tương tác từ người dùng.
- **Layout.tsx**: Khung sườn chung của ứng dụng (Skeleton, Header, Footer).
- **FieldInput.tsx**: Component hiển thị từng dòng nhập liệu (Key - Value). Nó độc lập và có thể tái sử dụng.
- **QRDisplay.tsx**: Component đảm nhiệm việc render mã QR từ dữ liệu đầu vào và xử lý các tác vụ như "Tải ảnh", "Sao chép".

#### B. Logic Layer (`src/App.tsx`, `src/hooks`)
Chịu trách nhiệm xử lý nghiệp vụ.
- **App.tsx**: Đóng vai trò là "Controller" hoặc "Container". Nó giữ trạng thái (State) của toàn bộ ứng dụng (danh sách các trường, tùy chọn màu sắc) và truyền xuống các component con.
- **useLocalStorage.ts**: Một Custom Hook đóng gói logic lưu trữ. Nó tự động đồng bộ state của React với LocalStorage của trình duyệt, đảm bảo dữ liệu không bị mất khi F5.

#### C. Data/Model Layer (`src/types`)
Định nghĩa định dạng dữ liệu (Schema) giúp thống nhất cách hiểu về dữ liệu trên toàn dự án.
- **Field**: `{ id: number, key: string, value: string }`
- **QROptions**: `{ colorDark: string, colorLight: string }`

## 4. Cấu trúc thư mục (Project Structure)

Dưới đây là sơ đồ cây thư mục và giải thích chi tiết chức năng của từng file/folder trong dự án:

```
/src
 ├── /components             # Các thành phần giao diện tái sử dụng (UI Building Blocks)
 │    ├── FieldInput.tsx     # [Single Responsibility] Hiển thị 01 dòng nhập liệu (gồm ô Key và ô Value). Xử lý việc nhập text và nút xóa dòng.
 │    ├── Layout.tsx         # [Wrapper] Khung sườn bao quanh ứng dụng. Chứa Header (Logo/Title), Footer và Grid layout chính. Giúp các trang con (nếu có sau này) luôn đồng bộ giao diện.
 │    ├── QRDisplay.tsx      # [Feature Component] Nhận dữ liệu text và render ra mã QR. Chứa logic xử lý nút "Tải ảnh" (Download) và "Sao chép" (Copy Clipboard).
 │    └── Toast.tsx          # [Feedback] Component thông báo nổi (Pop-up), tự động ẩn sau 2 giây. Dùng để báo "Đã sao chép" hoặc lỗi.
 ├── /hooks                  # Các logic nghiệp vụ tách biệt (Custom Hooks) - Giúp App.tsx gọn gàng hơn
 │    └── useLocalStorage.ts # [Persistence Logic] Hook này hoạt động giống useState nhưng có thêm tính năng tự động lưu/đọc dữ liệu từ trình duyệt. Đảm bảo F5 không mất dữ liệu.
 ├── /types                  # Định nghĩa kiểu dữ liệu (TypeScript Interfaces) - "Luật" của dự án
 │    └── index.ts           # Chứa các interfaces như `Field` (cấu trúc dòng dữ liệu) hay `QROptions` (cấu trúc tùy chỉnh màu). Giúp code tường minh và tránh lỗi sai kiểu.
 ├── App.tsx                 # [Main Container] Đây là bộ não của ứng dụng. Nó kết nối State (dữ liệu), Logic (Hooks) và UI (Components) lại với nhau.
 ├── main.tsx                # [Entry Point] Điểm khởi đầu của code React. File này gắn (mount) component App vào trong file index.html thật.
 └── index.css               # [Global Styles] Nơi cấu hình Tailwind CSS (directives) và các biến màu global (CSS Variables) cho chế độ sáng/tối hoặc giao diện Mac-style.
```

## 5. Lợi ích sau khi Refactor

1.  **Khả năng mở rộng (Scalability)**: Dễ dàng thêm các tính năng mới (ví dụ: Trang Login, Dashboard, History) mà không làm rối code cũ nhờ việc chia nhỏ Component.
2.  **Bảo trì (Maintainability)**: TypeScript giúp code minh bạch, IDE hỗ trợ nhắc lệnh tốt, giảm thiểu bug runtime.
3.  **Hiệu năng (Performance)**: React Virtual DOM và Vite giúp ứng dụng chạy nhanh, reload tức thì khi dev.
4.  **Trải nghiệm người dùng (UX)**: Dữ liệu được lưu lại tự động, không còn nỗi lo mất dữ liệu khi lỡ tay tắt tab.
