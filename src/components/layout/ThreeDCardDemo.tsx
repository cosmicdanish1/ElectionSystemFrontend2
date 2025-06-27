import { CardBody, CardContainer, CardItem } from "../../components/ui/3d-card";

export function ThreeDCardDemo() {
  return (
    <div className="flex flex-row flex-wrap justify-center items-center gap-4 p-10">
      
      {/* Role-Based Authentication Card */}
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl border-black/[0.1] w-auto sm:w-[30rem] h-[34rem] rounded-xl p-6 border">
          <CardItem translateZ="50" className="text-xl font-bold text-neutral-600">
            Role-Based Authentication
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 h-[3.5rem]"
          >
            Secure login and signup system tailored for different user roles.
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <img
              src="/public/im1.png"
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="Role-Based Authentication"
            />
          </CardItem>
        </CardBody>
      </CardContainer>

      {/* Dynamic Election & Candidate Management Card */}
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl border-black/[0.1] w-auto sm:w-[30rem] h-[34rem] rounded-xl p-6 border">
          <CardItem translateZ="50" className="text-xl font-bold text-neutral-600">
            Dynamic Election & Candidate Management
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 h-[3.5rem]"
          >
            Intuitive UI with full CRUD operations for all entities
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <img
              src="/public/im2.png"
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="Dynamic Management"
            />
          </CardItem>
        </CardBody>
      </CardContainer>

      {/* Real-Time Voting Results Visualization Card */}
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl border-black/[0.1] w-auto sm:w-[30rem] h-[34rem] rounded-xl p-6 border">
          <CardItem translateZ="50" className="text-xl font-bold text-neutral-600">
            Real-Time Voting Results Visualization
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="text-neutral-500 text-sm max-w-sm mt-2 h-[3.5rem]"
          >
            Live charts and winner insights on a clean dashboard
          </CardItem>
          <CardItem translateZ="100" className="w-full mt-4">
            <img
              src="/public/im3.png"
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="Voting Results Visualization"
            />
          </CardItem>
        </CardBody>
      </CardContainer>

    </div>
  );
}
