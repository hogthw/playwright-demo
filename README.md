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

# Test Case Login STG & Claim
Scope
Login CPS
Open Claim List
- I. Login CPS
+ TC01: Login thành công với thông tin hợp lệ
Precondition: User có tài khoản hợp lệ
Steps:
Truy cập trang login
Nhập username hợp lệ
Nhập password đúng
Click nút “Đăng nhập”
Expected Result: Đăng nhập thành công
Điều hướng sang trang dashboard (URL không còn /login)
+ TC02: Bỏ trống password
Steps:
Nhập username
Để trống password
Click “Đăng nhập”
Expected Result:
Hiển thị thông báo yêu cầu nhập password
Form không được submit
+ TC03: Bỏ trống username
Steps:
Để trống username
Nhập password
Click “Đăng nhập”
Expected Result:
Hiển thị thông báo yêu cầu nhập username
Không submit form
+ TC04: Sai username hoặc password
Steps:
Nhập username không hợp lệ
Nhập password không đúng
Click “Đăng nhập”
Expected Result:
Hiển thị thông báo lỗi đăng nhập
Không điều hướng sang trang khác
+ TC05: Đăng nhập bằng phím Enter
Steps:
Nhập username và password hợp lệ
Nhấn phím Enter
Expected Result:
Đăng nhập thành công
Điều hướng đúng trang
+ TC06: Clear input rồi nhập lại
Steps:
Nhập username và password
Xóa toàn bộ dữ liệu trong input
Nhập lại thông tin hợp lệ
Click “Đăng nhập”
Expected Result:
Đăng nhập thành công
Không bị lỗi validate trước đó
- II. Open Claim List
+ TC07: Mở trang claim list thành công
Precondition:
User đã đăng nhập
Steps:
Click menu “Claim”
Expected Result:
Hiển thị trang danh sách claim
Không lỗi giao diện
+ TC08: Hiển thị danh sách claim
Steps:
Login
Mở claim list
Expected Result:
Hiển thị bảng hoặc danh sách claim
Có dữ liệu nếu hệ thống có sẵn
+ TC09: Không có dữ liệu
Steps:
Truy cập claim list khi không có dữ liệu
Expected Result:
Hiển thị trạng thái rỗng (No data)
+ TC10: Reload trang
Steps:
Mở claim list
Refresh trang
Expected Result:
Dữ liệu vẫn hiển thị
Không bị mất trạng thái
+ TC11: Tìm kiếm claim (nếu có)
Steps:
Nhập keyword hoặc Order ID
Thực hiện tìm kiếm
Expected Result:
Hiển thị kết quả đúng với điều kiện tìm kiếm
