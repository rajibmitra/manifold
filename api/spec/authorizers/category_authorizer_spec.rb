require 'rails_helper'

RSpec.describe CategoryAuthorizer, :authorizer do
  let(:user) { FactoryGirl.create(:user) }
  let(:admin) { FactoryGirl.create(:user, role: User::ROLE_ADMIN) }

  describe 'class authorization' do
    context 'when creating' do
      it 'is true for admin' do
        expect(CategoryAuthorizer).to be_creatable_by(admin)
      end

      it 'is false for user' do
        expect(CategoryAuthorizer).to_not be_creatable_by(user)
      end
    end

    context 'when updating' do
      it 'is true for admin' do
        expect(CategoryAuthorizer).to be_updatable_by(admin)
      end

      it 'is false for user' do
        expect(CategoryAuthorizer).to_not be_updatable_by(user)
      end
    end

    context 'when deleting' do
      it 'is true for admin' do
        expect(CategoryAuthorizer).to be_deletable_by(admin)
      end

      it 'is false for user' do
        expect(CategoryAuthorizer).to_not be_deletable_by(user)
      end
    end
  end
end
