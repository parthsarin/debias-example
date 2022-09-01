import Loader from '../Loader';
import './NarrativePane.css';

interface NarrativePaneProps {
  output: string,
  loading: boolean
}

const NarrativePane = ({ output, loading }: NarrativePaneProps) => (
  <div className="h-full p-4 overflow-y-scroll">
    {loading && <Loader />}
    <h1 className="text-2xl mb-2">Debias an algorithm</h1>
    <p className="mb-2">
      Earlier, we saw how AI algorithms can be biased if the data that they 
      train on is biased. Because data is generated by humans, all data is biased. 
      Sometimes that doesn't matter — if an AI algorithm is used to  
      recommend songs to you on Spotify, the worst that could happen is that 
      you get a song you don't like. But, algorithms are also used to <a href="https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing" className="link">determine how much money defendants must pay</a> to leave jail, 
      or to <a href="https://www.govx.digital/technology/fuck-the-algorithm-protests-put-government-use-of-ai-in-spotlight" className="link">predict students' exam scores</a>.
    </p>
    <p className="mb-2">
      Those examples raise a challenging problem: when the stakes are high, 
      how can we prevent AI algorithms from replicating human biases?
    </p>
    <p className="mb-2">
      In this activity, you'll work with a real life AI algorithm, designed in 
      Python. Your goal is to remove the bias from this algorithm, while still
      maintaining accuracy.
    </p>
    {
      output 
      && (
      <pre className="mt-2 bg-gray-100 border rounded-md border-black p-3">
        <code>
          {output}
        </code>
      </pre>
      )
    }
  </div>
);

export default NarrativePane;