import { Timeline } from "../../components/ui/timeline";

export function TimelineMain() {
  const data = [
    {
      title: "1951–52",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm">
            India held its <strong>first general elections</strong> after gaining independence. Around 173 million people were eligible to vote, and the Indian National Congress won a majority. Jawaharlal Nehru became the first elected Prime Minister.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/JawaharlalNehru.jpg"
              alt="Jawaharlal Nehru"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/balatbox.png"
              alt="1952 Ballot Box"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "1977",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm">
            The 1977 general election marked the <strong>first defeat of the Congress Party</strong>. It was held after the Emergency period. The Janata Party, led by Morarji Desai, formed the government.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/MorarjiDesai.webp"
              alt="Morarji Desai"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/MorarjiD.webp"
              alt="1977 Election Voting"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "1984",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm">
            In 1984, after Indira Gandhi’s assassination, the Congress Party won by a landslide under <strong>Rajiv Gandhi</strong>. They secured more than 400 seats in the Lok Sabha — a record.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/Rajiv-Gandhi.jpg"
              alt="Rajiv Gandhi"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/rajiv-gandhi1.webp"
              alt="Rajiv Gandhi Campaign"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2014",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm">
            The 2014 general election saw a <strong>historic win for BJP</strong> under the leadership of <strong>Narendra Modi</strong>. The party won 282 seats on its own — ending the era of coalition politics.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/Modi.jpg"
              alt="Narendra Modi"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/bjp-victory-rally-in-delhi.webp"
              alt="BJP Victory Rally"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm">
            The <strong>2024 Lok Sabha elections</strong> witnessed high voter turnout with increasing digital awareness. Political parties used <strong>AI-driven campaigns, social media, and deepfake tech</strong> to reach voters. Democratic participation remained strong.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/Election.webp"
              alt="Voting in 2024"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
            <img
              src="/full.jpg"
              alt="Election Commission"
              className="aspect-video w-full rounded-lg object-cover shadow-md md:h-44 lg:h-60"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip bg-white text-black px-4 md:px-8 lg:px-20 py-8">
      <Timeline data={data} />
    </div>
  );
}
