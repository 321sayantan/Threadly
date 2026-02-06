import React, { useState, useEffect } from 'react'
import { Search, Users, X, Briefcase, MapPin, Building2, UserPlus, MessageCircle, Loader2 } from 'lucide-react'
import { searchUsers, suggestedUser, followOrUnfollow } from '@/http/api'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import useUserStore from '@/lib/store'
import { useNavigate } from 'react-router-dom'

// Dummy data for preview
const dummyUsers = [
    {
        _id: '1',
        username: 'Sarah Chen',
        bio: 'Full Stack Developer | React & Node.js Enthusiast | Building scalable web applications',
        profilePicture: 'https://i.pravatar.cc/150?img=1',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        experience: [
            { position: 'Senior Software Engineer', company: 'Tech Corp' }
        ],
        education: [
            { school: 'Stanford University', degree: 'Computer Science' }
        ],
        followers: ['2', '3', '4'],
        following: ['5', '6']
    },
    {
        _id: '2',
        username: 'Michael Rodriguez',
        bio: 'Product Designer | UX/UI Specialist | Creating delightful user experiences',
        profilePicture: 'https://i.pravatar.cc/150?img=12',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
        experience: [
            { position: 'Lead Product Designer', company: 'Design Studio' }
        ],
        education: [
            { school: 'MIT', degree: 'Design Technology' }
        ],
        followers: ['1', '3'],
        following: ['4', '5', '6']
    },
    {
        _id: '3',
        username: 'Emma Watson',
        bio: 'Data Scientist | ML Engineer | Turning data into insights',
        profilePicture: 'https://i.pravatar.cc/150?img=5',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL', 'Data Visualization'],
        experience: [
            { position: 'Data Scientist', company: 'Analytics Pro' }
        ],
        education: [
            { school: 'UC Berkeley', degree: 'Statistics' }
        ],
        followers: ['1', '2', '4', '5'],
        following: ['6']
    },
    {
        _id: '4',
        username: 'James Park',
        bio: 'DevOps Engineer | Cloud Architecture | Kubernetes Expert',
        profilePicture: 'https://i.pravatar.cc/150?img=15',
        skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
        experience: [
            { position: 'DevOps Engineer', company: 'CloudTech Solutions' }
        ],
        education: [
            { school: 'Georgia Tech', degree: 'Computer Engineering' }
        ],
        followers: ['2', '3'],
        following: ['1', '5']
    },
    {
        _id: '5',
        username: 'Priya Sharma',
        bio: 'Mobile Developer | iOS & Android | Flutter Enthusiast',
        profilePicture: 'https://i.pravatar.cc/150?img=9',
        skills: ['Flutter', 'Swift', 'Kotlin', 'React Native', 'Firebase'],
        experience: [
            { position: 'Mobile Developer', company: 'App Innovations' }
        ],
        education: [
            { school: 'IIT Delhi', degree: 'Software Engineering' }
        ],
        followers: ['1', '3', '4'],
        following: ['2', '6']
    },
    {
        _id: '6',
        username: 'David Thompson',
        bio: 'Cybersecurity Specialist | Ethical Hacker | Protecting digital assets',
        profilePicture: 'https://i.pravatar.cc/150?img=14',
        skills: ['Penetration Testing', 'Security Auditing', 'Network Security'],
        experience: [
            { position: 'Security Consultant', company: 'SecureNet Inc' }
        ],
        education: [
            { school: 'Carnegie Mellon', degree: 'Cybersecurity' }
        ],
        followers: ['2', '5'],
        following: ['1', '3', '4']
    },
    {
        _id: '7',
        username: 'Lisa Anderson',
        bio: 'Frontend Developer | CSS Artist | Building beautiful interfaces',
        profilePicture: 'https://i.pravatar.cc/150?img=10',
        skills: ['HTML', 'CSS', 'JavaScript', 'Tailwind', 'Animation'],
        experience: [
            { position: 'Frontend Developer', company: 'Creative Agency' }
        ],
        education: [
            { school: 'New York University', degree: 'Digital Media' }
        ],
        followers: ['1', '2', '3', '4', '5'],
        following: ['6']
    },
    {
        _id: '8',
        username: 'Alex Kim',
        bio: 'Backend Engineer | API Design | Microservices Architecture',
        profilePicture: 'https://i.pravatar.cc/150?img=13',
        skills: ['Java', 'Spring Boot', 'Microservices', 'GraphQL', 'Redis'],
        experience: [
            { position: 'Backend Engineer', company: 'Enterprise Solutions' }
        ],
        education: [
            { school: 'University of Toronto', degree: 'Software Engineering' }
        ],
        followers: ['3', '5', '7'],
        following: ['1', '2']
    }
];

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    // const [suggestedUsers, setSuggestedUsers] = useState() // Using dummy data
    const [isLoading, setIsLoading] = useState(false)
    const [activeFilter, setActiveFilter] = useState('all')
    const { user } = useUserStore()
    const navigate = useNavigate()
    const { setSuggestedUsers, suggestedUsers } = useUserStore();

    useEffect(() => {
        // Using dummy data, no need to fetch
        // fetchSuggestedUsers()
        const getSuggestedUser = async () => {
            const res = await suggestedUser();
            console.log(res.user)
            setSuggestedUsers(res.user);

            // setSuggestUsers(res.user);
        };

        // if (!suggestedUsers || suggestedUsers.length === 0)
            getSuggestedUser();
    }, [])

    useEffect(() => {
        if (searchQuery.trim()) {
            const debounceTimer = setTimeout(() => {
                handleSearch()
            }, 300)
            return () => clearTimeout(debounceTimer)
        } else {
            setSearchResults([])
        }
    }, [searchQuery])

    const fetchSuggestedUsers = async () => {
        // Uncomment when backend is ready
        // const res = await suggestedUser()
        // if (res.success) {
        //   setSuggestedUsers(res.users || [])
        // }
    }

    const handleSearch = async () => {
        if (!searchQuery.trim()) return
        setIsLoading(true)

        // Simulating API call with dummy data
        setTimeout(() => {
            const filtered = suggestedUsers.filter(u =>
                u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))// ||
                // u.experience[0]?.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                // u.experience[0]?.position.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setSearchResults(filtered)
            setIsLoading(false)
        }, 500)

        // Uncomment when backend is ready
        // const res = await searchUsers(searchQuery)
        // setIsLoading(false)
        // if (res.success) {
        //   setSearchResults(res.users || [])
        // }
    }

    const handleFollowToggle = async (userId) => {
        // Simulate follow/unfollow with dummy data
        const currentUserId = user?._id || 'current-user'

        // Update the UI locally
        setSearchResults(searchResults.map(u =>
            u._id === userId ? {
                ...u, followers: u.followers?.includes(currentUserId)
                    ? u.followers.filter(id => id !== currentUserId)
                    : [...(u.followers || []), currentUserId]
            } : u
        ))
        setSuggestedUsers(suggestedUsers.map(u =>
            u._id === userId ? {
                ...u, followers: u.followers?.includes(currentUserId)
                    ? u.followers.filter(id => id !== currentUserId)
                    : [...(u.followers || []), currentUserId]
            } : u
        ))

        // Uncomment when backend is ready
        // await followOrUnfollow(userId)
    }

    const handleUserClick = (userId) => {
        navigate(`/profile/${userId}`)
    }

    const clearSearch = () => {
        setSearchQuery('')
        setSearchResults([])
    }

    const UserCard = ({ user: searchUser, compact = false }) => {
        const currentUserId = user?._id || 'current-user'
        const isFollowing = searchUser.followers?.includes(currentUserId)

        return (
            <div className=" bg-[#f1ecec] dark:bg-[#0f0f13] rounded-lg overflow-hidden hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700">
                {/* Cover/Header Area */}
                <div className="h-20">
                    <img className="h-25 w-full object-cover bg-white dark:bg-[#19191d] "
                        src={searchUser.coverImage}
                        alt={` `} 
                        />
                </div>

                {/* Avatar */}
                <div className="relative px-4 pb-4 h-full">
                    <Avatar
                        className="h-30 w-30 m-auto -mt-15  border-4 border-white dark:border-gray-800 cursor-pointer"
                        onClick={() => handleUserClick(searchUser._id)}
                    >
                        <AvatarImage src={searchUser.profilePicture} alt={searchUser.username} className="object-cover"/>
                        <AvatarFallback className=" text-white text-2xl">
                            {searchUser.username?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    {/* User Info */}
                    <div className="mt-3">
                        <h3
                            className="font-semibold text-gray-900 dark:text-white text-xl hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate"
                            onClick={() => handleUserClick(searchUser._id)}
                        >
                            {searchUser.username}
                        </h3>

                        {searchUser.experience && searchUser.experience[0] && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                {searchUser.experience[0].title}
                            </p>
                        )}

                        {searchUser.title && (
                            <p className="text-xs text-gray-500 dark:text-gray-300 mt-2 line-clamp-2 h-8">
                                {searchUser.title}
                            </p>
                        )}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-3 space-y-2">
                        {searchUser.experience && searchUser.experience[0] && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{searchUser.experience[0].company}</span>
                            </div>
                        )}

                        {searchUser.education && searchUser.education[0] && (
                            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                                <span className="truncate">{searchUser.education[0].school}</span>
                            </div>
                        )}

                        {/* Followers count */}
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 pt-1">
                            <span>{searchUser.followers?.length || 0} followers</span>
                            <span>•</span>
                            <span>{searchUser.following?.length || 0} following</span>
                        </div>
                    </div>

                    {/* Skills */}
                    {/* {searchUser.skills && searchUser.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {searchUser.skills.slice(0, 2).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                </Badge>
                            ))}
                            {searchUser.skills.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                    +{searchUser.skills.length - 2}
                                </Badge>
                            )}
                        </div>
                    )} */}

                    {/* Action Buttons */}
                    {searchUser._id !== currentUserId && (
                        <div className="flex gap-2 mt-4">
                            <Button
                                size="sm"
                                variant={isFollowing ? "outline" : "default"}
                                className={`flex-1 ${isFollowing ? 'hover:bg-red-50 hover:text-red-600 hover:border-red-300' : 'bg-blue-600 hover:bg-blue-700'}`}
                                onClick={() => handleFollowToggle(searchUser._id)}
                            >
                                {isFollowing ? (
                                    <>
                                        <X className="h-4 w-4 mr-1" />
                                        Unfollow
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="h-4 w-4 mr-1" />
                                        Follow
                                    </>
                                )}
                            </Button>
                            {/* <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate('/message')}
                            >
                                <MessageCircle className="h-4 w-4" />
                            </Button> */}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const filters = [
        { id: 'all', label: 'All', icon: Users },
        { id: 'people', label: 'People', icon: Users },
    ]

    return (
        <div className="min-h-screen w-full bg-white dark:bg-black">
            {/* Header */}
            <div className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search for users, skills, companies..."
                                className="pl-10 pr-10 h-12 bg-gray-100 dark:bg-gray-700 border-none focus:ring-2 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {filters.map((filter) => {
                            const Icon = filter.icon
                            return (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeFilter === filter.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {filter.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : searchResults.length > 0 ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                            Search Results ({searchResults.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {searchResults.map((searchUser) => (
                                <UserCard key={searchUser._id} user={searchUser} />
                            ))}
                        </div>
                    </div>
                ) : searchQuery.trim() ? (
                    <div className="text-center py-20">
                        <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No results found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Try searching with different keywords
                        </p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                            <Users className="h-6 w-6" />
                            People you may know
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {suggestedUsers.length > 0 ? (
                                suggestedUsers.map((suggestedUser) => (
                                    <UserCard key={suggestedUser._id} user={suggestedUser} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10 text-gray-500 dark:text-gray-400">
                                    No suggestions available
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchPage