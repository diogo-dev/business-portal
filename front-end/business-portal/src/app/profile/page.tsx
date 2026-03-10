"use client";
import { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { LuPencil, LuCheck, LuCamera, LuInstagram, LuTwitter, LuFacebook } from "react-icons/lu";
import styles from "./page.module.css";
import { get, patch } from "../api";
import { toast } from "sonner";
import CircularProgress from '@mui/material/CircularProgress';

interface ProfileField {
  label: string;
  key: string;
  value: string;
  type?: string;
}

interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
}

const PERSONAL_FIELDS: ProfileField[] = [
  { label: "First Name", key: "firstName", value: "" },
  { label: "Last Name", key: "lastName", value: "" },
  { label: "Date of Birth", key: "dob", value: "", type: "date" },
  { label: "Age", key: "age", value: "", type: "number" },
  { label: "Gender", key: "gender", value: "" },
  { label: "Occupation", key: "occupation", value: "" },
];

const CONTACT_FIELDS: ProfileField[] = [
  { label: "Phone Number", key: "phone", value: "", type: "tel" },
  { label: "Postal Code", key: "postalCode", value: "" },
  { label: "City", key: "city", value: "" },
  { label: "State", key: "state", value: "" },
  { label: "Country", key: "country", value: "" },
];

const SOCIALS = [
  { key: "facebook" as const, icon: LuFacebook, label: "Facebook" },
  { key: "instagram" as const, icon: LuInstagram, label: "Instagram" },
  { key: "twitter" as const, icon: LuTwitter, label: "X (Twitter)" },
];

const Profile = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({
    facebook: "",
    instagram: "",
    twitter: "",
  });
  const [editingSocial, setEditingSocial] = useState<string | null>(null);
  const [socialLinkErrors, setSocialLinkErrors] = useState<Record<string, string>>({});
  const [personalFields, setPersonalFields] = useState(PERSONAL_FIELDS);
  const [contactFields, setContactFields] = useState(CONTACT_FIELDS);


    useEffect(() => {
      const fetchProfile = async () => {
        // fetch the logged user profile info and populate the states
        try {
          const token = localStorage.getItem("token");
          if (!token) throw new Error("No auth token found");

          const res = await get('/auth/me', token);
          if (!res.ok) throw new Error("Failed to fetch profile data");
          const data = await res.json();

          // Map the response data to the corresponding fields
          setPersonalFields((prev) =>
            prev.map((f) => ({ ...f, value: data.profile[f.key] || "" }))
          );
          setContactFields((prev) =>
            prev.map((f) => ({ ...f, value: data.profile[f.key] || "" }))
          );
          setAvatarUrl(data.profile.avatarUrl || "");
          setSocialLinks(data.profile.socialLinks || { facebook: "", instagram: "", twitter: "" });
        } catch (error) {
          toast.error("Failed to load profile information.");
        } 
      };

      fetchProfile();
    }, []);

  // Auxiliary functions
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const validateSocialLink = (platform: keyof SocialLinks, value: string): boolean => {
    if (!value) {
      setSocialLinkErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[platform];
        return newErrors;
      });
      return true;
    }

    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      setSocialLinkErrors((prev) => ({ ...prev, [platform]: 'URL must start with http:// or https://' }));
      return false;
    }

    setSocialLinkErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[platform];
      return newErrors;
    });
    return true;
  };

  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleUpdateProfile = async () => {
    if (!isDirty) return; 

    // Validate social links before saving
    let hasErrors = false;
    Object.entries(socialLinks).forEach(([platform, value]) => {
      if (value && !validateSocialLink(platform as keyof SocialLinks, value)) {
        hasErrors = true;
      }
    });

    if (hasErrors) {
      toast.error("Please fix invalid URLs before saving.");
      return;
    }

    // Build profile object 
    const profileData: Record<string, any> = {};
    
    // Add personal fields with type conversion
    personalFields.forEach((f) => {
      if (f.value) {
        if (f.key === 'age') {
          profileData[f.key] = parseInt(f.value);
        } else {
          profileData[f.key] = f.value;
        }
      }
    });
    
    // Add contact fields
    contactFields.forEach((f) => {
      if (f.value) {
        profileData[f.key] = f.value;
      }
    });
    
    // Add social links and avatar
    profileData.socialLinks = socialLinks;
    if (avatarUrl) {
      profileData.avatarUrl = avatarUrl;
    }

    const body = {
      profile: profileData
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No auth token found");
      }

      const [res] = await Promise.all([
        patch('/auth/me', body, token),
        delay(1000)
      ])

      if (!res.ok) {
        throw new Error("Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setIsDirty(false);
    } catch (error) {
      console.log("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }

  };

  const handleFieldChange = (key: string, newValue: string, section: "personal" | "contact") => {
    setIsDirty(true);
    const setter = section === "personal" ? setPersonalFields : setContactFields;

    if (key === "phone") {
      // Armazena apenas números para o phone
      const numbersOnly = newValue.replace(/\D/g, '').slice(0, 11);
      setter((prev) => prev.map((f) => (f.key === key ? { ...f, value: numbersOnly } : f)));
    } else {
      setter((prev) => prev.map((f) => (f.key === key ? { ...f, value: newValue } : f)));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
    setIsDirty(true);
    setSocialLinks((prev) => ({ ...prev, [platform]: value }));
    // Clear error while typing
    if (socialLinkErrors[platform]) {
      setSocialLinkErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[platform];
        return newErrors;
      });
    }
  };

  const toggleSocialEdit = (key: keyof SocialLinks) => {
    // Validate when closing (if switching from edit to view)
    if (editingSocial === key) {
      validateSocialLink(key, socialLinks[key]);
    }
    setEditingSocial(editingSocial === key ? null : key);
  };

  const toggleEdit = (key: string) => {
    setEditingField(editingField === key ? null : key);
  };

  const renderField = (field: ProfileField, section: "personal" | "contact") => (
    <div key={field.key} className={styles.fieldCard}>
      <div className={styles.fieldContent}>
        <p className={styles.fieldLabel}>{field.label}</p>
        {editingField === field.key ? (
          <input
            type={field.type || "text"}
            value={field.key === "phone" ? formatPhone(field.value) : field.value}
            onChange={(e) => handleFieldChange(field.key, e.target.value, section)}
            autoFocus
            className={styles.fieldInput}
          />
        ) : (
          <p className={styles.fieldValue}>
            {field.key === "phone" ? formatPhone(field.value) : field.value}
          </p>
        )}
      </div>
      <button onClick={() => toggleEdit(field.key)} className={styles.editButton}>
        {editingField === field.key ? (
          <LuCheck className={styles.icon} />
        ) : (
          <LuPencil className={styles.icon} />
        )}
      </button>
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Account</h1>
        <p className={styles.subtitle}>Manage your personal information and preferences</p>

        {/* Avatar */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatarInner}>
              <Avatar
                src={avatarUrl || undefined}
                sx={{
                  width: 110,
                  height: 110,
                  fontSize: 40,
                  fontWeight: 700,
                  bgcolor: "hsl(220, 25%, 18%)",
                  color: "hsl(150, 60%, 54%)",
                }}
              >
                {!avatarUrl && "JD"}
              </Avatar>
            </div>
            <label className={styles.avatarOverlay}>
              <LuCamera className={styles.cameraIcon} />
              <input
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <p className={styles.avatarName}>{personalFields.find((f) => f.key === "firstName")?.value || "User Name"}</p>
          <p className={styles.avatarRole}>{personalFields.find((f) => f.key === "occupation")?.value || "Occupation"}</p>
        </div>

        {/* Personal Info */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionDot} />
            <p className={styles.sectionTitle}>Personal Information</p>
          </div>
          <div className={styles.fieldsGrid}>
            {personalFields.map((f) => renderField(f, "personal"))}
          </div>
        </div>

        {/* Contact & Location */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionDot} />
            <p className={styles.sectionTitle}>Contact & Location</p>
          </div>
          <div className={styles.fieldsGrid}>
            {contactFields.map((f) => renderField(f, "contact"))}
          </div>
        </div>

        {/* Social Links */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionDot} />
            <p className={styles.sectionTitle}>Social Links</p>
          </div>
          <div className={styles.socialCard}>
            <div className={styles.socialList}>
              {SOCIALS.map(({ key, icon: Icon, label }, i) => (
                <div key={key}>
                  <div className={styles.socialRow}>
                    <div className={styles.socialIcon}>
                      <Icon />
                    </div>
                    <div className={styles.socialContent}>
                      {editingSocial === key ? (
                        <div style={{ width: '100%' }}>
                          <input
                            type="url"
                            placeholder={`${label} profile URL`}
                            value={socialLinks[key]}
                            onChange={(e) => handleSocialChange(key, e.target.value)}
                            autoFocus
                            className={styles.socialInput}
                            style={{ borderColor: socialLinkErrors[key] ? '#ef4444' : undefined }}
                          />
                          {socialLinkErrors[key] && (
                            <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>
                              {socialLinkErrors[key]}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className={`${styles.socialValue} ${socialLinks[key] ? styles.socialValueFilled : ""}`}>
                          {socialLinks[key] || `Add ${label} link`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => toggleSocialEdit(key)}
                      className={styles.editButton}
                    >
                      {editingSocial === key ? (
                        <LuCheck className={styles.icon} />
                      ) : (
                        <LuPencil className={styles.icon} />
                      )}
                    </button>
                  </div>
                  {i < SOCIALS.length - 1 && <hr className={styles.divider} />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          className={styles.saveButton} 
          onClick={handleUpdateProfile}
          disabled={loading || !isDirty}
        >
          {loading ? <CircularProgress size={15} color="success"/> : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
