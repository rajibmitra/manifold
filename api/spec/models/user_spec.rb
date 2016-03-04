require "rails_helper"

# rubocop:disable Metrics/LineLength
RSpec.describe User, type: :model do
  it "should not be valid without a password" do
    user = User.new password: nil, password_confirmation: nil
    expect(user).to_not be_valid
  end

  it "should be not be valid with a short password" do
    user = User.new password: "short", password_confirmation: "short"
    expect(user).to_not be_valid
  end

  it "should not be valid with a confirmation mismatch" do
    user = User.new password: "short", password_confirmation: "long"
    expect(user).to_not be_valid
  end

  context "already exists" do
    let(:user) do
      u = User.create email: "test@test.com", password: "password", password_confirmation: "password"
      User.find u.id
    end

    it "should be valid with no changes" do
      expect(user).to be_valid
    end

    it "should not be valid with an empty password" do
      user.password = user.password_confirmation = " "
      expect(user).to_not be_valid
    end

    it "should be valid with a new (valid) password" do
      user.password = user.password_confirmation = "new password"
      expect(user).to be_valid
    end

    it "should be able to authenticate" do
      the_user = user
      u = User.find_by(email: "test@test.com").try(:authenticate, "password")
      expect(u).to eq(the_user)
    end

    it "should not authenticate if the password is incorrect" do
      u = User.find_by(email: "test@test.com").try(:authenticate, "rambo")
      expect(u).to eq(nil)
    end
  end
end
