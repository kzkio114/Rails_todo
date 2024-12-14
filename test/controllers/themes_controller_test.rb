require "test_helper"

class ThemesControllerTest < ActionDispatch::IntegrationTest
  test "should get toggle" do
    get themes_toggle_url
    assert_response :success
  end
end
