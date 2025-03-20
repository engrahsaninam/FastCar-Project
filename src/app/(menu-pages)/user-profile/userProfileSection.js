"use client"
import React, { useState } from 'react';

import { ChevronDown, ChevronUp, Eye, EyeOff, User, FileText, Lock, Bell, X, Truck, Mail, Shield, Plus } from 'lucide-react';


const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
};

// Keep existing ProfileSection, Input, and Toggle components the same...
const ProfileSection = ({ title, icon, children, isOpen, onToggle }) => {
  return (
    <div className="mb-4 bg-white rounded-lg shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {isOpen ?
          <ChevronUp className="text-red-500" size={20} /> :
          <ChevronDown className="text-red-500" size={20} />
        }
      </button>
      {isOpen && (
        <div className="p-4 border-t border-gray-100">{children}</div>
      )}
    </div>
  );
};

const Input = ({ label, type = "text", value = "", onChange, icon, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs uppercase text-gray-600 mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full p-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
        {...props}
      />
      {icon && <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500">{icon}</span>}
    </div>
  </div>
);

const Toggle = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-100 last:border-0">
    <div>
      <h3 className="font-medium text-gray-800">{label}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-red-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  </div>
);


const UserProfile = () => {

  const [emailInfo, setEmailInfo] = useState({
    primaryEmail: 'user@example.com',
    isVerified: true,
    additionalEmails: [
      { email: 'work@company.com', isVerified: true },
      { email: 'personal@mail.com', isVerified: false }
    ],
    showAddEmail: false,
    newEmail: ''
  });

  const [sections, setSections] = useState({
    email: false,
    contact: false,
    billing: false,
    delivery: false,
    password: false,
    notifications: false
  });

  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [newPrimaryEmail, setNewPrimaryEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [changeEmailError, setChangeEmailError] = useState('');

  const [contactInfo, setContactInfo] = useState({
    name: '',
    surname: '',
    telephone: ''
  });

  const [billingInfo, setBillingInfo] = useState({
    isCompany: false,
    isVatPayer: false,
    companyId: '',
    companyName: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'Czech Republic'
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'Czech Republic',
    sameAsBilling: false
  });

  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: ''
  });



  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    favorites: false,
    searches: false
  });

  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleContactChange = (field) => (e) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleBillingChange = (field) => (e) => {
    setBillingInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleDeliveryChange = (field) => (e) => {
    setDeliveryInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handlePasswordChange = (field) => (e) => {
    setPasswordInfo(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleChangeEmail = (e) => {
    e.preventDefault();
    // Here you would typically make an API call to change the email
    if (!newPrimaryEmail || !currentPassword) {
      setChangeEmailError('Please fill in all fields');
      return;
    }

    // For demo purposes, just update the state
    setEmailInfo(prev => ({
      ...prev,
      primaryEmail: newPrimaryEmail,
    }));

    setEmailInfo(prev => ({
      ...prev,
      primaryEmail: newPrimaryEmail,
    }));

    setNewPrimaryEmail('');
    setCurrentPassword('');
    setChangeEmailError('');
    setShowChangeEmailModal(false);
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmailInfo(prev => ({
      ...prev,
      additionalEmails: prev.additionalEmails.filter(email => email.email !== emailToRemove)
    }));
  };

  const handleResendVerification = (email) => {
    // Here i would typically call an API to resend verification
    console.log(`Resending verification to ${email}`);
  };

  return (
    <div className="md:p-10 p-4 w-full md:w-[60%] mx-auto min-h-[70vh] max-w-[896px]">  
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My profile</h1>

      <Modal
        isOpen={showChangeEmailModal}
        onClose={() => setShowChangeEmailModal(false)}
        title="Change Primary Email"
      >
        <form onSubmit={handleChangeEmail}>
          <Input
            label="NEW EMAIL ADDRESS"
            type="email"
            value={newPrimaryEmail}
            onChange={(e) => setNewPrimaryEmail(e.target.value)}
            placeholder="Enter new email address"
          />
          <Input
            label="CURRENT PASSWORD"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your password"
          />
          {changeEmailError && (
            <p className="text-red-500 text-sm mb-4">{changeEmailError}</p>
          )}
          <button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Change Email
          </button>
        </form>
      </Modal>

      <ProfileSection
        title="Contact information"
        icon={<User size={20} className="text-red-500" />}
        isOpen={sections.contact}
        onToggle={() => toggleSection('contact')}
      >
        <div className="grid md:grid-cols-2 gap-8">
          <Input
            label="NAME"
            placeholder="Name"
            value={contactInfo.name}
            onChange={handleContactChange('name')}
          />
          <Input
            label="SURNAME"
            placeholder="Surname"
            value={contactInfo.surname}
            onChange={handleContactChange('surname')}
          />
        </div>
        <Input
          label="TELEPHONE NUMBER"
          placeholder="+420 123456789"
          type="tel"
          value={contactInfo.telephone}
          onChange={handleContactChange('telephone')}
        />
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </ProfileSection>

      <ProfileSection

        title="Email accounts"
        icon={<Mail size={20} className="text-red-500" />}
        isOpen={sections.email}
        onToggle={() => toggleSection('email')}
      >
        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Primary email</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-900">{emailInfo.primaryEmail}</p>
                  {emailInfo.isVerified && (
                    <div className="flex items-center text-green-600 text-sm">
                      <Shield size={14} className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowChangeEmailModal(true)}
                className="text-red-500 text-sm hover:text-red-600"
              >
                Change
              </button>
            </div>
          </div>

          {/* Additional Emails */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Additional email accounts</h3>
            <div className="space-y-3">
              {emailInfo.additionalEmails.map((email, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900">{email.email}</p>
                    {email.isVerified ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <Shield size={14} className="mr-1" />
                        Verified
                      </div>
                    ) : (
                      <button
                        onClick={() => handleResendVerification(email.email)}
                        className="text-red-500 text-sm hover:text-red-600"
                      >
                        Verify email
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveEmail(email.email)}
                    className="text-gray-500 text-sm hover:text-gray-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Email */}
          {emailInfo.showAddEmail ? (
            <div className="mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new email address"
                  value={emailInfo.newEmail}
                  onChange={(e) => setEmailInfo(prev => ({ ...prev, newEmail: e.target.value }))}
                  type="email"
                />
                <button
                  onClick={handleAddNewEmail}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEmailInfo(prev => ({ ...prev, showAddEmail: true }))}
              className="flex items-center text-red-500 hover:text-red-600 mt-4"
            >
              <Plus size={20} className="mr-2" />
              Add another email
            </button>
          )}
        </div>
      </ProfileSection>

      <ProfileSection
        title="Billing information"
        icon={<FileText size={20} className="text-red-500" />}
        isOpen={sections.billing}
        onToggle={() => toggleSection('billing')}
      >
        <div className="flex gap-4 mb-6">
          <button
            className={`flex-1 py-2 px-4 rounded transition-colors ${!billingInfo.isCompany ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setBillingInfo(prev => ({ ...prev, isCompany: false }))}
          >
            Consumer
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded transition-colors ${billingInfo.isCompany ? 'bg-gray-100 text-gray-600' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setBillingInfo(prev => ({ ...prev, isCompany: true }))}
          >
            Company
          </button>
        </div>

        {billingInfo.isCompany && (
          <>
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={billingInfo.isVatPayer}
                  onChange={(e) => setBillingInfo(prev => ({ ...prev, isVatPayer: e.target.checked }))}
                  className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">I'm a VAT payer</span>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <Input
                label="COMPANY ID"
                placeholder="Company ID"
                value={billingInfo.companyId}
                onChange={handleBillingChange('companyId')}
              />
              <Input
                label="COMPANY NAME"
                placeholder="Company name (if you are self-employed, your first and last name)"
                value={billingInfo.companyName}
                onChange={handleBillingChange('companyName')}
              />
            </div>
          </>
        )}

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Billing address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="STREET"
              placeholder="Street"
              value={billingInfo.street}
              onChange={handleBillingChange('street')}
            />
            <Input
              label="HOUSE NUMBER"
              placeholder="House number"
              value={billingInfo.houseNumber}
              onChange={handleBillingChange('houseNumber')}
            />
            <Input
              label="POSTAL CODE"
              placeholder="232 00"
              value={billingInfo.postalCode}
              onChange={handleBillingChange('postalCode')}
            />
            <Input
              label="CITY"
              placeholder="City"
              value={billingInfo.city}
              onChange={handleBillingChange('city')}
            />
            <div className="col-span-2">
              <Input
                label="COUNTRY"
                placeholder="Czech Republic"
                value={billingInfo.country}
                onChange={handleBillingChange('country')}
              />
            </div>
          </div>
        </div>

        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </ProfileSection>

      <ProfileSection
        title="Delivery information"
        icon={<Truck size={20} className="text-red-500" />}
        isOpen={sections.delivery}
        onToggle={() => toggleSection('delivery')}
      >
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={deliveryInfo.sameAsBilling}
              onChange={(e) => {
                setDeliveryInfo(prev => ({
                  ...prev,
                  sameAsBilling: e.target.checked,
                  ...(e.target.checked ? {
                    street: billingInfo.street,
                    houseNumber: billingInfo.houseNumber,
                    postalCode: billingInfo.postalCode,
                    city: billingInfo.city,
                    country: billingInfo.country
                  } : {})
                }));
              }}
              className="rounded border-gray-300 text-red-500 focus:ring-red-500"
            />
            <span className="text-sm text-gray-600">Same as billing address</span>
          </label>
        </div>

        {!deliveryInfo.sameAsBilling && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="STREET"
              placeholder="Street"
              value={deliveryInfo.street}
              onChange={handleDeliveryChange('street')}
            />
            <Input
              label="HOUSE NUMBER"
              placeholder="House number"
              value={deliveryInfo.houseNumber}
              onChange={handleDeliveryChange('houseNumber')}
            />
            <Input
              label="POSTAL CODE"
              placeholder="232 00"
              value={deliveryInfo.postalCode}
              onChange={handleDeliveryChange('postalCode')}
            />
            <Input
              label="CITY"
              placeholder="City"
              value={deliveryInfo.city}
              onChange={handleDeliveryChange('city')}
            />
            <div className="col-span-2">
              <Input
                label="COUNTRY"
                placeholder="Czech Republic"
                value={deliveryInfo.country}
                onChange={handleDeliveryChange('country')}
              />
            </div>
          </div>
        )}

        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </ProfileSection>

      <ProfileSection
        title="Change password"
        icon={<Lock size={20} className="text-red-500" />}
        isOpen={sections.password}
        onToggle={() => toggleSection('password')}
      >
        <Input
          label="CURRENT PASSWORD"
          type={showPassword ? "text" : "password"}
          value={passwordInfo.currentPassword}
          onChange={handlePasswordChange('currentPassword')}
          icon={
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ?
                <EyeOff size={20} className="text-red-500" /> :
                <Eye size={20} className="text-red-500" />
              }
            </button>
          }
        />
        <Input
          label="NEW PASSWORD"
          type={showPassword ? "text" : "password"}
          value={passwordInfo.newPassword}
          onChange={handlePasswordChange('newPassword')}
          icon={
            <button onClick={() => setShowPassword(!showPassword)}>
              {showPassword ?
                <EyeOff size={20} className="text-red-500" /> :
                <Eye size={20} className="text-red-500" />
              }
            </button>
          }
        />
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded mt-4">
          Save
        </button>
      </ProfileSection>

      <ProfileSection
        title="Notification settings"
        icon={<Bell size={20} className="text-red-500" />}
        isOpen={sections.notifications}
        onToggle={() => toggleSection('notifications')}
      >
        <Toggle
          label="Favourite vehicles"
          description="Send notifications about discounts on favourite vehicles"
          checked={notifications.favorites}
          onChange={() => setNotifications(prev => ({
            ...prev,
            favorites: !prev.favorites
          }))}
        />
        <Toggle
          label="Saved searches"
          description="Send notifications of new offers based on saved search filters"
          checked={notifications.searches}
          onChange={() => setNotifications(prev => ({
            ...prev,
            searches: !prev.searches
          }))}
        />
      </ProfileSection>
    </div>
  );
};

export default UserProfile;