import React from 'react'

export default function SignUp() {
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full mb-5 border p-4">
            <h2 className="text-center text-2xl font-bold mb-2"> <span className="text-red-500">ল</span>গিন করুন</h2>
            <p> শিক্ষার্থীর যাবতীয় তথ্য দেখার জন্য লগিন করুন </p>
            <label className="label">শিক্ষার্থীর মোবাইল নম্বর</label>
            <input type="number" className="input w-full" placeholder="মোবাইল নম্বর" />

            <label className="label">শিক্ষার্থীর পাসওয়ার্ড</label>
            <input type="password" className="input w-full" placeholder="পাসওয়ার্ড" />

            <button className="btn btn-neutral mt-4"> পরবর্তী ধাপ </button>
        </fieldset>
  )
}
