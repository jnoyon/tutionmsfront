import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase/firebase.init";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { AuthContext } from "../firebase/AuthProvider";
import "react-toastify/dist/ReactToastify.css";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    phone: "",
    fatherName: "",
    address: "",
    instituteName: "",
    batch: "",
    gender: "", // No default
    image: "",
    isActive: false,
  });
  const [docId, setDocId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const IMGBB_API_KEY = "a4a8bae3716c8eddc39b29357af6a8a9";

  useEffect(() => {
    if (!user?.studentId) return;

    const q = query(collection(db, "students"), where("studentId", "==", user.studentId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        setFormData({
          studentId: data.studentId || "",
          name: data.name || "",
          phone: data.phone || "",
          fatherName: data.fatherName || "",
          address: data.address || "",
          instituteName: data.instituteName || "",
          batch: data.batch || "",
          gender: data.gender || "",
          image: data.image || "",
          isActive: data.isActive || false,
        });
        setDocId(docSnap.id);
      } else {
        toast.error("No profile found for this Student ID!");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (formData.gender !== "মেইল") {
      toast.error("ফটো শুধুমাত্র মেইল শিক্ষার্থীর জন্য!");
      return;
    }

    setUploading(true);
    const formDataObj = new FormData();
    formDataObj.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: "POST",
        body: formDataObj,
      });
      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        toast.success("ফটো সফলভাবে আপলোড হয়েছে!");
      } else {
        toast.error("ফটো আপলোড ব্যর্থ হয়েছে!");
      }
    } catch (err) {
      console.error(err);
      toast.error("ফটো আপলোড ব্যর্থ হয়েছে: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docId) return toast.error("No profile to update");

    try {
      const docRef = doc(db, "students", docId);
      await updateDoc(docRef, formData);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-11/12 mb-5">
      <ToastContainer autoClose={2000} position="top-right" theme="light" />
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldset bg-white border-base-300 rounded-box w-full border p-4">
          <legend className="fieldset-legend">প্রোফাইল তথ্য</legend>

          {/* Student ID */}
          <label className="label">স্টুডেন্ট আইডি</label>
          <input
            type="text"
            name="studentId"
            className="input w-full border border-gray-400"
            value={formData.studentId}
            disabled
          />

          {/* IsActive */}
          <label className="label">ভর্তি অবস্থা</label>
          <input
            type="text"
            className="input w-full border border-gray-400"
            value={formData.isActive ? "Confirmed" : "Pending"}
            disabled
          />

          {/* Name */}
          <label className="label">আপনার নাম</label>
          <input
            type="text"
            name="name"
            className="input w-full"
            value={formData.name}
            onChange={handleChange}
          />

          {/* Phone */}
          <label className="label">মোবাইল নম্বর</label>
          <input
            type="tel"
            name="phone"
            className="input w-full"
            value={formData.phone}
            onChange={handleChange}
          />

          {/* Father Name */}
          <label className="label">পিতার নাম</label>
          <input
            type="text"
            name="fatherName"
            className="input w-full"
            value={formData.fatherName}
            onChange={handleChange}
          />

          {/* Address */}
          <label className="label">ঠিকানা</label>
          <input
            type="text"
            name="address"
            className="input w-full"
            value={formData.address}
            onChange={handleChange}
          />

          {/* Institute Name */}
          <label className="label">শিক্ষা প্রতিষ্ঠানের নাম</label>
          <input
            type="text"
            name="instituteName"
            className="input w-full"
            value={formData.instituteName}
            onChange={handleChange}
          />

          {/* Batch */}
          <label className="label">ব্যাচ</label>
          <div className="flex gap-4 border bg-white border-gray-300 rounded-md p-2">
            {["ইন্টেন্সিভ", "ফোকাস", "কম্পিউটার"].map((b) => (
              <label key={b} className="flex items-center gap-1">
                <input
                  type="radio"
                  className="radio"
                  name="batch"
                  value={b}
                  checked={formData.batch === b}
                  onChange={handleChange}
                />
                {b}
              </label>
            ))}
          </div>

          {/* Gender */}
          <label className="label">জেন্ডার</label>
          <div className="flex gap-4 border bg-white border-gray-300 rounded-md p-2 mb-2">
            {["মেইল", "ফিমেইল"].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  className="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center mb-4">
            <img
              src={formData.image || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full border-2 border-gray-300 object-cover mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files[0])}
              disabled={formData.gender !== "মেইল"}
              className={formData.gender !== "মেইল" ? "opacity-50 cursor-not-allowed" : ""}
            />
            {formData.gender !== "মেইল" && formData.gender !== "" && (
              <p className="text-red-500 text-sm mt-1">ফটো শুধুমাত্র মেইল শিক্ষার্থীর জন্য!</p>
            )}
          </div>

          <button
            type="submit"
            className={`btn btn-neutral mt-4 w-full ${uploading ? "loading" : ""}`}
            disabled={uploading}
          >
            আপডেট করুন
          </button>
        </fieldset>
      </form>
    </div>
  );
}
