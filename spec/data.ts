export const arr = (a: number = int(10, 20), b = a) => new Array(Math.trunc(int(a, b) || 1)).fill(0)

export const string = (length: number = int(10, 20)) =>
  arr(length / 5 + 1)
    .map(i =>
      Math.random()
        .toString(36)
        .substr(2, 5)
    )
    .reduce((a, b) => a.concat(b))

export const char = () => String.fromCharCode(int('a'.charCodeAt(0), 'a'.charCodeAt(0) + 25))

export const words = (
  wordCount = int(10, 20),
  wordLength = int(5, 10),
  wordCountB = wordCount,
  wordLengthB = wordLength
) => arr(wordCount, wordCountB).map(i => string(int(wordLength, wordLengthB)))

export const int = (a = 10, b = a) => Math.floor(Math.random() * b) + (a === b ? 0 : a)

export const float = (a = 10, b = a) => Math.random() * b + (a === b ? 0 : a)

export function color() {
  const colors = ['red', 'blue', 'cyan', 'green', 'magenta', 'yellow']
  return colors[int(0, colors.length - 1)]
}

export function item<T = any>(a: T[]): T {
  return a[int(0, a.length - 1)]
}

export function longText() {
  return `
Dolor velit eiusmod in in amet et sit ex non ipsum enim.
Nostrud sint minim nostrud irure ullamco sit cillum veniam id commodo.

(double new lines)

## a Markdown like fragment

 * foo
 * bar
 * and a very long line:

Amet laboris veniam adipisicing irure id do velit occaecat quis ut do commodo irure. Et amet labore Lorem sit occaecat sunt ullamco. Fugiat quis reprehenderit id id anim id deserunt eiusmod laborum ad labore. Tempor cillum sint mollit do eu non cillum id ut sunt. Commodo adipisicing sit culpa mollit commodo et duis eu quis aliquip amet mollit elit consectetur. Culpa esse ad non nisi duis laboris esse elit magna magna.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Exercitation ut duis cillum mollit ea. Amet ea Lorem officia est occaecat nisi ut quis. Eiusmod ex proident adipisicing non ipsum.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Aliquip tempor sint magna et reprehenderit do Lorem qui aute mollit officia. Duis sint nulla irure sit sunt cillum irure aliquip cupidatat adipisicing officia ipsum sit ullamco. Culpa et tempor aliqua ex exercitation adipisicing officia elit enim occaecat ullamco esse.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Duis ad consectetur laboris deserunt magna adipisicing duis cillum. Ut ut minim dolor est culpa qui. Sit excepteur sint ipsum commodo do veniam culpa id in minim veniam fugiat minim. Velit in minim velit mollit sunt ea occaecat non officia duis. Enim et duis aute aliquip aliquip velit consequat ex Lorem. Veniam dolor cupidatat laborum ad laborum amet quis amet.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Enim qui cillum ut adipisicing. Irure irure nostrud qui quis incididunt tempor ad irure veniam officia nulla ullamco dolor. Eiusmod voluptate sint proident ullamco ex aliqua ad cupidatat do consectetur. Consectetur exercitation laborum velit exercitation irure eiusmod fugiat. Duis elit non laborum exercitation ad do veniam exercitation. Id aute nostrud aute consequat incididunt cillum enim irure. Ullamco dolor nisi dolore deserunt esse cillum.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Ut ad anim enim in exercitation. Voluptate eu esse sint labore laborum Lorem deserunt velit eu occaecat. Sit anim ex et excepteur ad. Aute laboris aliquip irure cillum ipsum labore deserunt. Ea anim aliqua nisi dolor enim officia qui in eiusmod qui.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Occaecat voluptate cillum ad esse fugiat amet ex incididunt dolor esse. Sint ut eu aute enim excepteur eu enim sunt ex aute adipisicing labore non. Non incididunt Lorem ullamco ipsum nisi. Tempor dolore eiusmod sit culpa Lorem incididunt magna enim.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

Proident sit culpa ex cillum. Nostrud dolore excepteur consequat elit enim. Ipsum cupidatat ea incididunt occaecat fugiat eu ex consequat velit. Eu labore adipisicing ut commodo dolore in dolor dolore. Eu proident pariatur dolore sunt elit velit pariatur officia consequat tempor deserunt. Amet mollit consectetur officia esse laborum id occaecat culpa amet minim laborum esse dolor commodo. Laboris pariatur cillum laboris pariatur deserunt est aliquip Lorem in cillum labore eiusmod anim et.

Incididunt deserunt sit consequat consequat velit. Do eiusmod sit sit minim irure in eiusmod nulla labore eu in sunt reprehenderit. Eiusmod nisi fugiat veniam reprehenderit magna laboris. Deserunt dolor eu laboris nostrud excepteur cupidatat incididunt nisi id voluptate dolor consequat. Dolore duis labore nulla ipsum anim duis sunt eu magna enim.
Exercitation dolor dolore tempor quis exercitation officia esse sunt sunt.
Veniam sint ullamco duis occaecat laboris cupidatat. Sit do nulla dolor reprehenderit ut.
In labore ipsum occaecat excepteur velit laboris mollit amet ipsum nisi fugiat eiusmod aute.
Sit sint exercitation qui officia enim. Esse adipisicing adipisicing nostrud ut fugiat
esse ex pariatur fugiat veniam id esse.

    `.trim()
}
