import React from 'react'
import { Card } from '../ui/card';
import PostHeader from './PostHeader';
import MediaCarousel from './MediaCarousel';
import EngagementBar from './EngagementBar';
import Comment from './Comment';

const samplePost = {
    user: {
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      title: "Product Manager at TechCorp • Speaker • Mentor",
      isVerified: true,
      connectionDegree: 2
    },
    timestamp: "2h ago",
    content: "Just finished presenting our new product roadmap at #ProductCon! Excited about the innovative features we're launching next quarter. Thanks to @SarahT and the amazing design team for the collaboration.\n\nWhat emerging tech trends are you most excited about for 2025? #ProductManagement #Innovation #TechTrends",
    media: [
      {
        type: 'image',
        src: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?q=80&w=1170&auto=format&fit=crop",
        alt: "Product presentation"
      },
      {
        type: 'image',
        src: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1170&auto=format&fit=crop",
        alt: "Team celebrating"
      }
    ],
    engagement: {
      likes: 142,
      comments: 28,
      shares: 17,
      saved: false
    },
    skills: [
      { name: "Product Management", endorsements: 87 },
      { name: "Strategic Planning", endorsements: 54 },
      { name: "Product Roadmapping", endorsements: 32 },
      { name: "Team Leadership", endorsements: 61 }
    ],
    relevance: {
      jobTitle: "Product Manager",
      company: "Tech Innovations Inc",
      reason: "Matches your experience in product development"
    }
  };


export const Post = ({Post}) => {
    const renderFormattedContent = (text) => {
    // Split by spaces to identify words
    return text.split(/\s+/).map((word, index, array) => {
      if (word.startsWith('#')) {
        // Hashtag
        return (
          <React.Fragment key={index}>
            <span className="hashtag">{word}</span>
            {index < array.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      } else if (word.startsWith('@')) {
        // Mention
        return (
          <React.Fragment key={index}>
            <span className="mention">{word}</span>
            {index < array.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      } else {
        // Regular word
        return (
          <React.Fragment key={index}>
            {word}
            {index < array.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      }
    })}

  return (
    <>
      <Card className="w-[600px] m-auto mb-8 overflow-hidden border-social-gray-light shadow-sm hover:shadow-md transition-shadow">
        {/* <PostHeader user={user} timestamp={timestamp} /> */}
        <PostHeader
          user={{
            name: `${Post.author.username}`,
            avatar: `${Post.author.profilePicture}`,
            title: "UX/UI Designer • Digital Nomad • Creative Coach",
            isVerified: true,
            connectionDegree: 1,
          }}
          timestamp="6h ago"
          post = {Post}
        />

        {Post.caption!=="undefined" && (
          <div className="px-4 mb-3 text-sm">
            <p className="whitespace-pre-line">
              {renderFormattedContent(Post.caption)}
            </p>
          </div>
        )}

        {Post.images.length > 0 && <MediaCarousel media={Post.images} />}

        <EngagementBar
          initialLikes={Post.likes.length}
          initialComments={Post.comments.length}
          initialShares={samplePost.engagement.shares}
          initialSaved={samplePost.engagement.saved}
          post = {Post}
        />

        {/* <ProfessionalContext skills={skills} relevance={relevance} /> */}
        <Comment></Comment>
      </Card>
    </>
  );
}
