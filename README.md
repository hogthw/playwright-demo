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

* Mục tiêu Day 2
Học hệ thống mẫu và viết testcase thực tế.

Triển khai: Login CPS và Open Claim List.

Tiến độ: Hoàn tất 06 kịch bản (01 Happy Path + 05 Validation/Security) trong vòng 2h

Cải tiến kỹ thuật:

Refactor cấu trúc code: Gom nhóm kịch bản bằng test.describe và dùng beforeEach để tối ưu luồng khởi tạo, giúp code sạch và dễ bảo trì.

Nâng cấp tương tác: Áp dụng page.keyboard (giả lập phím) và input.clear() để xử lý triệt để dữ liệu rác, đảm bảo môi trường test sạch.

Kiểm soát lỗi (Error Handling): Sử dụng các Assertions nâng cao (expect) để bắt chính xác các thông báo lỗi (Validation messages) từ hệ thống.

Kết quả: 100% Test cases đạt trạng thái Passed.
