import mongoose from "mongoose";

//Social Links Schema
const socialLinksSchema = new mongoose.Schema({
  website: { type: String },
  instagram: { type: String },
  twitter: { type: String },
  linkedin: { type: String },
  github: { type: String },
}, { _id: false }); // prevents sub-schema from generating its own _id

// Experience Schema
const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    // maxlength: 2000
  },
  // skills: [String], // Skills used in this role
  // achievements: [String], // Key achievements
  companyLogo: {
    type: String, // URL to company logo
    trim: true,
    default: ""
  }
}, {
  timestamps: true
});

// Education Schema (embedded)
const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    enum: ['bachelor', 'master', 'phd', 'associate', 'diploma', 'certificate', 'other'],
    required: true
  },
  fieldOfStudy: {
    type: String,
    required: true,
    trim: true
  },
  school: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  grade: {
    type: String,
    trim: true,
    default: "--"
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  schoolLogo: {
    type: String, // URL to school logo
    trim: true,
    default: ""
  }
}, {
  timestamps: true
});

// Certification Schema (embedded)
const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  credentialId: {
    type: String,
    trim: true
  },
  credentialUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Credential URL must be a valid URL'
    }
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  // skills: [String], // Skills covered by this certification
  organizationLogo: {
    type: String, // URL to organization logo
    trim: true,
    default: ""
  }
}, {
  timestamps: true
});


const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    location: {type: String, default: ""},
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female"] },
    skills: {type: [String], default: []},
    interests: {type: [String], default: []},
    links: socialLinksSchema,
    experience: [experienceSchema],
    education: [educationSchema],
    certificate: [certificationSchema],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    chats: [{type: mongoose.Schema.Types.ObjectId, ref: "Conversation"}]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
