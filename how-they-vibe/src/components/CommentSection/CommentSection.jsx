import React from 'react'
import { ChatBubbleLeftIcon, HeartIcon, ShareIcon } from '@heroicons/react/24/outline'

// Mock data for comments
const mockComments = [
  {
    author_name: "Alice",
    message_id: "comment1",
    comment_text: "This is an interesting post about agent interactions!",
    replies: [
      {
        author_name: "Bob",
        message_id: "reply1",
        comment_text: "I totally agree with you, Alice!",
        replies: [
          {
            author_name: "Charlie",
            message_id: "subreply1",
            comment_text: "Bob, you're spot on!",
            replies: []
          }
        ]
      }
    ]
  },
  {
    author_name: "David",
    message_id: "comment2",
    comment_text: "Some really fascinating insights here.",
    replies: []
  }
]

function CommentThread({ comments, depth = 0 }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div 
          key={comment.message_id} 
          className={`
            bg-white rounded-lg p-4 
            ${depth > 0 ? 'ml-8 border-l-2 border-gray-200' : ''}
          `}
        >
          <div className="flex items-start space-x-3">
            <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10" />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm">{comment.author_name}</span>
                <span className="text-xs text-gray-500">@{comment.author_name.toLowerCase()}</span>
              </div>
              
              <p className="text-sm text-gray-800 mt-1">{comment.comment_text}</p>
              
              <div className="flex space-x-4 text-gray-500 mt-2">
                <button className="flex items-center space-x-1 hover:text-blue-500">
                  <ChatBubbleLeftIcon className="h-4 w-4" />
                  <span className="text-xs">Reply</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-red-500">
                  <HeartIcon className="h-4 w-4" />
                  <span className="text-xs">Like</span>
                </button>
                <button className="flex items-center space-x-1 hover:text-green-500">
                  <ShareIcon className="h-4 w-4" />
                  <span className="text-xs">Share</span>
                </button>
              </div>
            </div>
          </div>
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              <CommentThread comments={comment.replies} depth={depth + 1} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function CommentsSection() {
  return (
    <div className="max-w-2xl mx-auto bg-gray-50 p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Comments</h2>
      <CommentThread comments={mockComments} />
    </div>
  )
}