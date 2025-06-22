import { Timeline } from "../../components/ui/timeline";

export function TimelineMain() {
  const data = [
    {
      title: "1951–52",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-black md:text-sm">
            India held its <strong>first general elections</strong> after gaining independence. Around 173 million people were eligible to vote, and the Indian National Congress won a majority. Jawaharlal Nehru became the first elected Prime Minister.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/public/JawaharlalNehru.jpg"
              alt="Jawaharlal Nehru"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/public/balatbox.png"
              alt="1952 Ballot Box"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "1977",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-black md:text-sm">
            The 1977 general election marked the <strong>first defeat of the Congress Party</strong>. It was held after the Emergency period. The Janata Party, led by Morarji Desai, formed the government.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/public/MorarjiDesai.webp"
              alt="Morarji Desai"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/public/MorarjiD.webp"
              alt="1977 Election Voting"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "1984",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-black md:text-sm">
            In 1984, after Indira Gandhi’s assassination, the Congress Party won by a landslide under <strong>Rajiv Gandhi</strong>. They secured more than 400 seats in the Lok Sabha — a record.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/public/Rajiv-Gandhi.jpg"
              alt="Rajiv Gandhi"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/public/rajiv-gandhi1.webp"
              alt="Rajiv Gandhi Campaign"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2014",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-black md:text-sm">
            The 2014 general election saw a <strong>historic win for BJP</strong> under the leadership of <strong>Narendra Modi</strong>. The party won 282 seats on its own — ending the era of coalition politics.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/public/Modi.jpg"
              alt="Narendra Modi"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/public/bjp-victory-rally-in-delhi.webp"
              alt="BJP Victory Rally"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-black md:text-sm">
            The <strong>2024 Lok Sabha elections</strong> witnessed high voter turnout with increasing digital awareness. Political parties used <strong>AI-driven campaigns, social media, and deepfake tech</strong> to reach voters. Democratic participation remained strong.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/public/Election.webp"
              alt="Voting in 2024"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/public/full.jpg"
              alt="Election Commission"
              width={500}
              height={500}
              className="h-20 w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip bg-white text-black">
      <Timeline data={data} />
    </div>
  );
}
