# Day 1 - Automation Test với Playwright
Project thực hiện nghiên cứu công cụ Playwright và triển khai kiểm thử tự động cho tính năng Liên hệ trên web ETON (https://eton.vn/vi/Contact).

* Demo và Kết quả
Link Video Demo: (https://www.youtube.com/watch?v=mQ0f5I2rDsg)

Source code: Nằm trong thư mục tests/

Lệnh chạy test: npx playwright test | npx playwright test --ui

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

# Day 2
Test-Driven Development (TDD)
Khái niệm
Test-Driven Development (TDD) là phương pháp phát triển phần mềm trong đó test được viết trước, sau đó mới viết code để đáp ứng test.
Mục tiêu là đảm bảo code đúng yêu cầu ngay từ đầu và dễ bảo trì về sau.

Quy trình TDD
Một vòng lặp TDD bao gồm các bước sau:

1. Write Test (Viết test trước)
Xác định chức năng cần thực hiện (ví dụ: login thành công)
Viết test case mô tả hành vi mong muốn
Ở bước này chưa có code xử lý nên test sẽ fail
Ví dụ:
User nhập đúng username và password thì đăng nhập thành công
2. Run Test (Chạy test – Fail)
Thực thi test vừa viết
Kết quả sẽ fail do chưa có phần implement
Ý nghĩa:
Đảm bảo test hoạt động đúng
Tránh trường hợp test sai nhưng vẫn pass
3. Write Code (Viết code để pass test)
Viết code tối thiểu để test có thể pass
Không cần tối ưu ngay, chỉ cần đúng logic
Ví dụ:
Implement chức năng login
Trong automation: viết đúng selector và action
4. Run Test (Pass)
Chạy lại test sau khi đã viết code
Kết quả phải pass
Ý nghĩa:
Xác nhận code đã đáp ứng yêu cầu đề ra
5. Refactor (Tối ưu code)
Làm sạch và cải thiện code
Tối ưu cấu trúc
Loại bỏ code dư
Tái sử dụng lại các phần chung
Sau khi refactor, test vẫn phải pass
6. Lặp lại
Tiếp tục viết test cho chức năng mới
Lặp lại toàn bộ quy trình
Tóm tắt vòng lặp TDD
Viết test
Chạy test (fail)
Viết code để pass
Chạy test (pass)
Refactor
Lặp lại

Áp dụng trong project
Ví dụ với chức năng login:
Viết test kiểm tra login thành công
Chạy test và thấy fail
Viết code để thực hiện login
Chạy lại test và pass

# Test Case Login STG
Scope
Login CPS
TC01 – Bỏ trống email
Steps:
Vào trang login OTP
Không nhập email
Click “Gửi mã OTP”
Expected:
Hiển thị thông báo: “Vui lòng nhập Email”
TC02 – Email sai định dạng
Steps:
Nhập email: ffff
Click “Gửi mã OTP”
Expected:
Hiển thị lỗi định dạng email (browser validation hoặc message UI)
TC03 – Email chưa tồn tại
Steps:
Nhập email không có trong hệ thống
fake_email@gmail.com
Click “Gửi mã OTP”
Expected:
Hiển thị lỗi: “Tài khoản không tồn tại trong hệ thống”
TC04 – OTP sai
Steps:
Nhập email hợp lệ
Gửi OTP
Nhập OTP: 000000
Click “Xác thực”
Expected:
Hiển thị lỗi: OTP không hợp lệ / sai / hết hạn
LOGIN SUCCESS
TC06 – Đăng nhập OTP thành công
Steps:
Nhập email hợp lệ
Gửi OTP
Lấy OTP từ Gmail
Nhập OTP đúng
Click “Xác thực”
Expected:
Đăng nhập thành công
Hiển thị: “Đăng nhập: <email>”
Chuyển sang trang dashboard

# DAY 4 — Playwright như RPA (Login + OTP)
Mục tiêu
Sử dụng Playwright như một công cụ RPA (browser automation)
Test flow đăng nhập bằng OTP giống user thực tế
Kiểm tra hệ thống với nhiều loại email khác nhau
Mindset Test
Test theo hành vi người dùng thật (low-tech user)
Không phụ thuộc vào kỹ thuật phức tạp (IMAP, đọc mail tự động)
Tập trung vào trải nghiệm thực tế:
Nhập email
Nhận OTP
Nhập OTP thủ công
Đăng nhập

Các test đã thực hiện
1. Validation
Bỏ trống email
Email sai định dạng
Email không tồn tại
2. OTP Fail
Nhập OTP sai → hiển thị lỗi
3. Login bằng OTP (RPA)
Nhập email
Gửi OTP
Dừng test (page.pause())
User tự:
Tick CAPTCHA
Lấy OTP từ mail (webmail)
Nhập OTP
Xác thực → chuyển sang dashboard
4. Multi Email Context

Test với nhiều loại email:

Gmail (test@gmail.com)
Outlook (test@outlook.com)
Domain nội bộ (tester@vota.vn)

Mục tiêu:

Kiểm tra hệ thống xử lý email input
Không cần login vào từng mail
5. User Flow thực tế (RPA)

Mô phỏng hành vi user thật:

Nhập email
Gửi OTP
Mở mail → lấy OTP
Tick CAPTCHA
Nhập OTP
Đăng nhập
Video & Report
Video được lưu tại:
test-results/
Report HTML:
npx playwright show-report