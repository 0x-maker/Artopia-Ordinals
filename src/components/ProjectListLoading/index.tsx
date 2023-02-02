import ProjectCardSkeleton from '@components/ProjectCard/skeleton';
import { v4 } from 'uuid';

const ProjectListLoading = ({
  numOfItems = 8,
  cols = 4,
}: {
  numOfItems?: number;
  cols?: number;
}) => {
  return (
    <div className={`grid grid-cols-${cols} gap-24`}>
      {[...Array(numOfItems)].map(() => (
        <ProjectCardSkeleton key={`token-loading-${v4()}`} />
      ))}
    </div>
  );
};

export default ProjectListLoading;
