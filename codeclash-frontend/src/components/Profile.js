import { useState, useEffect } from "react";
import Navbar2 from "./Navbar2"


const Profile = () => {

    const token = sessionStorage.getItem('Authtoken');

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        username: "",
        department: "",
        college: "",
        dob: "",
        gender: "",
        profilePicUrl:"",
        phoneNumber: "",
        githubLink: "",
        linkedinLink: "",
    });

    const [profilePic, setProfilePic] = useState(null);
    const currentUsername = localStorage.getItem("Username");

    // Function to Fetch User Profile
    const getUserDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8788/api/updateUserProfileGetByUsername/${currentUsername}` , {
                method : "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,  // Correct Bearer Token format
                    "Content-Type": "application/json"  // Required for JSON-based requests
                }
            });
            const data = await response.json();

            // Updating State with API Response, Handling Null Values
            setProfile({
                name: data.name || "",
                email: data.email || "",
                username: data.username || "",
                department: data.department || "",
                college: data.college || "",
                dob: data.dob || "",
                gender: data.gender || "",
                profilePicUrl:data.profilePicUrl || "",
                phoneNumber: data.phoneNumber || "",
                githubLink: data.githubLink || "",
                linkedinLink: data.linkedinLink || "",
            });

            // Set Profile Picture if Available
            if (data.profilePicUrl) {
                setProfilePic(data.profilePicUrl);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        }
    };

    useEffect(() => {
        getUserDetails();

        console.log(profile);
        
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfilePic(imageUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Profile Updated!");
    };

    const  updateUser = async () => {
        try{
            const response = await fetch(`http://localhost:8788/api/updateUserProfile/${currentUsername}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`, 
                    "Content-Type": "application/json"  
                },
                body: JSON.stringify(profile)
            });

            const updateItem = await response.json()
            postDetails();
            console.log("Data updated");
            
        }catch(e){
            console.log("Error" , e);
            
        }
    }


    const postDetails = async () => {
        if (!profilePic) {
            console.log("No image selected");
            return;
        }
    
        const data = new FormData();
        data.append("file", profilePic); // Append image file
        data.append("upload_preset", "your_upload_preset"); // Replace with your Cloudinary upload preset
        data.append("cloud_name", "your_cloud_name"); // Replace with your Cloudinary cloud name
    
        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", {
                method: "POST",
                body: data
            });
    
            const cloudinaryData = await response.json();
    
            if (cloudinaryData.secure_url) {
                console.log("Image uploaded successfully:", cloudinaryData.secure_url);
                setProfilePic(cloudinaryData.secure_url); // Update profile picture state
                setProfile({ ...profile, profilePicUrl: cloudinaryData.secure_url }); // Update profile state
            } else {
                console.error("Error uploading image:", cloudinaryData);
            }
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    return (
        <div>
            <Navbar2 />
            <div className="flex bg-gray-100">
                {/* Left Section - Profile Overview */}
                <div className="w-72 bg-purple-800 text-white p-6 flex flex-col items-center rounded-r-xl shadow-lg">
                    {/* Profile Picture */}
                    <div className="w-36 h-36 rounded-full border-4 border-white overflow-hidden mb-4">
                        {profilePic ? (
                            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <img src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fpngtree.com%2Fso%2Fdefault&psig=AOvVaw0ewh7u0UmT7GWQOSFa9zOH&ust=1743112198153000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCOjewI3dqIwDFQAAAAAdAAAAABAJ" alt="" className="w-full h-full object-cover" />
                        )}
                    </div>

                    {/* User Details */}
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-sm text-gray-200">{profile.email}</p>
                    <p className="text-sm text-gray-300 mt-1">{profile.phoneNumber}</p>
                    <p className="text-sm text-gray-300 mt-1">{profile.department}, {profile.college}</p>

                    {/* Social Links */}
                    <div className="flex space-x-4 mt-4">
                        <a href={profile.githubLink} target="_blank" className="bg-gray-700 px-3 py-2 rounded-lg hover:bg-gray-600">GitHub</a>
                        <a href={profile.linkedinLink} target="_blank" className="bg-blue-500 px-3 py-2 rounded-lg hover:bg-blue-400">LinkedIn</a>
                    </div>
                    {/* Extra Profile Details Section */}
                    <div className="flex">
                        <div className="grid grid-cols-1 gap-6 mt-8">
                            <div className="bg-white shadow-md p-4 rounded-lg text-center">
                                <h3 className="text-xl font-bold text-purple-800">10</h3>
                                <p className="text-gray-500 text-sm">Challenges Completed</p>
                            </div>
                            <div className="bg-white shadow-md p-4 rounded-lg text-center">
                                <h3 className="text-xl font-bold text-purple-800">5</h3>
                                <p className="text-gray-500 text-sm">Achievements</p>
                            </div>
                            <div className="bg-white shadow-md p-4 rounded-lg text-center">
                                <h3 className="text-xl font-bold text-purple-800">15</h3>
                                <p className="text-gray-500 text-sm">Friends</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Profile Form & Stats */}
                <div className="flex-1 flex flex-col items-center p-8">
                    <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-3xl">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Profile Settings</h2>

                        {/* Profile Image Upload */}
                        <div className="flex justify-center mb-6">
                            <label htmlFor="profilePic" className="relative cursor-pointer">
                                <div className="w-36 h-36 rounded-full border-4 border-purple-600 flex items-center justify-center overflow-hidden bg-gray-200">
                                    {profilePic ? (
                                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-gray-500">Upload</span>
                                    )}
                                </div>
                                <input type="file" id="profilePic" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                        </div>

                        {/* Profile Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" name="name" value={profile.name} placeholder="Full Name" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" />
                                <input type="email" name="email" value={profile.email} placeholder="Email" className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" disabled />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" name="username" value={currentUsername} placeholder="Username" className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" disabled />
                                <input type="text" name="department" value={profile.department} placeholder="Department" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" name="college" value={profile.college} placeholder="College" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" />
                                <input type="date" name="dob" value={profile.dob} placeholder="Date of Birth" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <select name="gender" value={profile.gender} onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none">
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <input type="text" name="phoneNumber" value={profile.phoneNumber} placeholder="Phone Number" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <input type="text" name="githubLink" value={profile.githubLink} placeholder="GitHub Profile" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" />
                                <input type="text" name="linkedinLink" value={profile.linkedinLink} placeholder="LinkedIn Profile" onChange={handleChange} className="w-full px-4 py-3 border rounded-lg focus:ring focus:ring-purple-300 outline-none" />
                            </div>

                            <button onClick={() => {updateUser()}} type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200">
                                Update Profile
                            </button>
                        </form>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Profile;