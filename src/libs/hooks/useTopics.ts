import { useMemo } from 'react';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import type { Topic } from '@/libs/services/modules/topics/topicType';

/**
 * Custom hook to manage topics efficiently across the application
 *
 * This hook provides:
 * - Automatic fetching of all topics with caching via RTK Query
 * - Utility functions to get topics by ID(s), names, or search
 * - Loading and error states
 * - Optimized performance with memoization
 *
 * @example
 * ```tsx
 * // Basic usage - get all topics
 * const { topics, isLoading } = useTopics();
 *
 * // Get specific topics by IDs
 * const { getTopicsByIds } = useTopics();
 * const userTopics = getTopicsByIds([1, 2, 3]);
 *
 * // Search functionality
 * const { searchTopics } = useTopics();
 * const searchResults = searchTopics('technology');
 *
 * // Check if topic exists
 * const { hasTopicWithId } = useTopics();
 * const exists = hasTopicWithId(5);
 * ```
 *
 * @returns Object containing topics array, loading state, utilities, and error handling
 */
export const useTopics = () => {
  // Fetch all topics once and cache the result
  const { data: topicsResponse, isLoading, error, refetch } = useGetTopicsQuery({
    limit: 100, // Get all topics at once
  });

  const topics = topicsResponse?.data || [];

  // Memoized utilities for better performance
  const topicsUtils = useMemo(() => {
    const topicsMap = new Map<number, Topic>();
    topics.forEach((topic: Topic) => {
      topicsMap.set(topic.id, topic);
    });

    return {
      /**
       * Get all topics as array
       * @returns {Topic[]} Array of all topics
       */
      getAllTopics: () => topics,

      /**
       * Get a single topic by ID
       * @param {number} id - Topic ID
       * @returns {Topic | undefined} Topic object or undefined if not found
       *
       * @example
       * const topic = getTopicById(1);
       * if (topic) {
       *   console.log(topic.name);
       * }
       */
      getTopicById: (id: number): Topic | undefined => {
        return topicsMap.get(id);
      },

      /**
       * Get multiple topics by their IDs
       * @param {number[]} ids - Array of topic IDs
       * @returns {Topic[]} Array of found topics (excludes not found)
       *
       * @example
       * const userTopics = getTopicsByIds([1, 3, 5]);
       */
      getTopicsByIds: (ids: number[]): Topic[] => {
        return ids.map(id => topicsMap.get(id)).filter(Boolean) as Topic[];
      },

      /**
       * Get topics by exact name matches (case insensitive)
       * @param {string[]} names - Array of topic names
       * @returns {Topic[]} Array of matching topics
       *
       * @example
       * const topics = getTopicsByNames(['Technology', 'science']);
       */
      getTopicsByNames: (names: string[]): Topic[] => {
        const lowerNames = names.map(name => name.toLowerCase());
        return topics.filter((topic: Topic) =>
          lowerNames.includes(topic.name.toLowerCase()),
        );
      },

      /**
       * Search topics by partial name match (case insensitive)
       * @param {string} searchTerm - Search term
       * @returns {Topic[]} Array of matching topics
       *
       * @example
       * const results = searchTopics('tech'); // finds 'Technology', 'FinTech', etc.
       */
      searchTopics: (searchTerm: string): Topic[] => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return topics.filter((topic: Topic) =>
          topic.name.toLowerCase().includes(lowerSearchTerm),
        );
      },

      /**
       * Get the internal topics Map for O(1) lookups
       * @returns {Map<number, Topic>} Topics map
       *
       * @example
       * const topicsMap = getTopicsMap();
       * const topic = topicsMap.get(1);
       */
      getTopicsMap: () => topicsMap,

      /**
       * Check if a topic exists by ID
       * @param {number} id - Topic ID
       * @returns {boolean} True if topic exists
       *
       * @example
       * if (hasTopicWithId(1)) {
       *   // Topic exists, safe to use
       * }
       */
      hasTopicWithId: (id: number): boolean => {
        return topicsMap.has(id);
      },

      /**
       * Get topic names by their IDs
       * @param {number[]} ids - Array of topic IDs
       * @returns {string[]} Array of topic names (excludes not found)
       *
       * @example
       * const names = getTopicNamesByIds([1, 2, 3]);
       * console.log(names); // ['Technology', 'Science', 'Art']
       */
      getTopicNamesByIds: (ids: number[]): string[] => {
        return ids.map(id => topicsMap.get(id)?.name).filter(Boolean) as string[];
      },
    };
  }, [topics]);

  return {
    topics,
    isLoading,
    error,
    refetch,
    ...topicsUtils,
  };
};

/**
 * Hook specifically for getting topics with "All" option included
 * This is commonly used in topic selection components like filters
 *
 * @param {string} allLabel - Label for the "All" option (default: 'All')
 * @returns Object with topics including "All" option, original topics, and utilities
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { topics } = useTopicsWithAll('Tất cả');
 *
 * // In a filter component
 * const TopicFilter = () => {
 *   const { topics, isLoading } = useTopicsWithAll(t('all'));
 *
 *   if (isLoading) return <Loading />;
 *
 *   return (
 *     <div>
 *       {topics.map(topic => (
 *         <FilterButton key={topic.id} topic={topic} />
 *       ))}
 *     </div>
 *   );
 * };
 * ```
 */
export const useTopicsWithAll = (allLabel: string = 'All') => {
  const { topics, isLoading, error, ...utils } = useTopics();

  const topicsWithAll = useMemo(() => {
    const allTopic = {
      id: 0, // Use 0 as ID for "All" option
      name: allLabel,
      iconName: 'squares-four',
    };
    return [allTopic, ...topics];
  }, [topics, allLabel]);

  return {
    /**
     * Topics array including "All" option as first item
     */
    topics: topicsWithAll,
    /**
     * Original topics array without "All" option
     */
    topicsWithoutAll: topics,
    isLoading,
    error,
    ...utils,
  };
};

export default useTopics;
