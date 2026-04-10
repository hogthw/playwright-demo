Báo cáo Day 1 - Automation Test với Playwright
Project thực hiện nghiên cứu công cụ Playwright và triển khai kiểm thử tự động cho tính năng Liên hệ trên web ETON (https://eton.vn/vi/Contact).

* Demo và Kết quả
Link Video Demo: (https://www.youtube.com/watch?v=mQ0f5I2rDsg)

Source code: Nằm trong thư mục tests/

Lệnh chạy test: npx playwright test

Lệnh xem báo cáo: npx playwright show-report

Dạ em xin trả lời các câu hỏi: 
1. Số lượng test cases cần thiết cho Form Liên hệ
Để đảm bảo form hoạt động ổn định và ngăn chặn dữ liệu rác, em nghĩ cần ít nhất 07 testcase:

TC01 (Happy Path): Nhập đầy đủ, đúng định dạng và gửi thành công (Đã thực hiện).

TC02 (Validation): Để trống các trường bắt buộc có dấu (*) và kiểm tra thông báo lỗi của hệ thống.

TC03 (Email Format): Nhập email sai định dạng để kiểm tra tính năng bắt lỗi đầu vào.

TC04 (Phone Format): Nhập số điện thoại chứa ký tự đặc biệt hoặc sai độ dài quy định.

TC05 (Boundary): Nhập dữ liệu vượt quá giới hạn ký tự ở ô thắc mắc để kiểm tra hiển thị.

TC06 (Security - Captcha): Nhấn gửi khi chưa xác thực Captcha (Đã thực hiện - Hệ thống phải chặn).

TC07 (Security - SQL Injection): Nhập các ký tự đặc biệt vào ô input để kiểm tra tính bảo mật.

2. Lý do chọn demo 2 trường hợp Success và Fail (Captcha)
Em ưu tiên chọn 2 case này vì em nghĩ người dùng sẽ gặp 2 trường hợp này nhiều nhất:

Trường hợp Success: Xác nhận luồng nghiệp vụ chính (Happy Path) hoạt động ổn định.

Trường hợp Fail (Captcha): Kiểm tra khả năng xử lý của script khi gặp lỗi người dùng phổ biến nhất (quên xác thực Captcha).

3. Thời gian hoàn thành và Kiến thức đạt được
Tổng cộng chính xác: 6 tiếng từ 2 tiếng 08/04 đến 4 tiếng 09/04 (từ lúc nghiên cứu tài liệu đến khi đẩy code lên GitHub). /Dạ em hứa các task sau sẽ đẩy tiến độ nhanh hơn, mong anh tha lỗi cho em lần này ạ/

Kiến thức đã nắm sâu sau Day 1:

Cài đặt và cấu hình môi trường Node.js, Playwright thành công, sử dụng thành thạo Playwright Inspector để tối ưu viết script.

Thành thạo các thao tác cơ bản: Fill, Click và Expect.

Sử dụng getByRole, getByText kết hợp với exact match để xử lý lỗi Strict mode violation, đảm bảo script chạy ổn định và giảm thiểu flaky test khi giao diện thay đổi.

Kỹ năng xử lý lỗi thực tế: Đọc Call log để debug locator (lỗi strict mode violation) và cấu hình tự động chụp Screenshot khi test thất bại.

# Day 2 - Testing Theory & Application

## 1. Lý thuyết testing

### Testing là gì?
Testing là quá trình kiểm tra hệ thống nhằm đảm bảo:
- Chức năng hoạt động đúng
- Không lỗi ở các luồng chính
- Dữ liệu hiển thị chính xác

Testing không chỉ là click cho chạy, mà là đảm bảo khi user sử dụng thực tế thì không xảy ra lỗi.

---

### Mục tiêu của testing
- Phát hiện lỗi trước khi release production
- Đảm bảo flow business chạy đúng
- Giảm rủi ro khi nhiều bộ phận cùng sử dụng hệ thống

---

## 2. Các loại test

### Functional Testing
Kiểm tra chức năng hệ thống

Ví dụ:
- Login có thành công không
- Tạo claim có lưu được không

---

### UI Testing
Kiểm tra giao diện

Ví dụ:
- Button có click được không
- Input có nhập được không

---

### Integration Testing
Kiểm tra luồng giữa các hệ thống/bộ phận

Ví dụ:
- CPS → Kho → Transport

---

### End-to-End Testing
Kiểm tra toàn bộ flow từ đầu đến cuối

Ví dụ:
- Login → tạo claim → xử lý → đóng claim

(Playwright dùng để automate phần này)

---

## 3. Các kiểu test case

### Positive
- Test với dữ liệu đúng
- Expected: hệ thống hoạt động thành công

Ví dụ:
- Login đúng → vào hệ thống
- Nhập đủ thông tin → tạo claim thành công

---

### Negative
- Test với dữ liệu sai hoặc thiếu
- Expected: hệ thống báo lỗi

Ví dụ:
- Sai OTP
- Không nhập email
- Thiếu field

---

### Edge Case
- Test các trường hợp đặc biệt, dễ gây lỗi

Ví dụ:
- Email hợp lệ nhưng chưa tồn tại
- Upload file lớn
- Nhập nội dung quá dài

---

## 4. Áp dụng vào hệ thống Claim

### Các thành phần
- Client
- CPS
- Kho
- Transport
- 3PL

---

### Flow thực tế

1. Client login bằng email + OTP  
2. Tạo claim request  
3. CPS tiếp nhận (status: Mở → Mới)  
4. CPS xử lý và assign  
5. Kho / Transport xử lý  
6. CPS trả kết quả cho client  
7. Đóng request  

---

## 5. Các điểm cần test

### Luồng chính
- Login
- Tạo claim
- CPS thấy claim
- CPS tiếp nhận
- Assign xử lý
- Các bên phản hồi
- Đóng claim

---

### Những chỗ dễ lỗi
- OTP login (sai mã, timeout)
- Search / filter claim
- Status không cập nhật đúng
- Assign sai người
- Upload file lỗi

---

### Dữ liệu cần kiểm tra
- Claim có được lưu không
- Status có đổi đúng không
- Nội dung phản hồi có đúng không
- File có upload được không

---

## 6. Mapping lý thuyết với thực tế

- Functional → Login, tạo claim  
- Integration → CPS, Kho, Transport  
- End-to-End → toàn bộ flow claim  
- Negative → sai OTP, thiếu dữ liệu  
- Edge case → file lớn, dữ liệu dài  

---

## 7. Kết luận

- Testing cần hiểu flow hệ thống trước khi viết test
- Không chỉ test happy case mà cần test cả negative và edge case
- Hệ thống nhiều role → dễ phát sinh lỗi integration